import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.parcel import Parcel
from app.models.record_of_rights import RecordOfRights
from app.models.registration_record import RegistrationRecord
from app.models.mutation_record import MutationRecord
from app.models.encumbrance import Encumbrance
from app.models.court_case import CourtCase
from app.models.verification import VerificationResult
from app.core.config import settings


class VerificationEngine:
    """
    Deterministic rule-based verification engine for land parcels.
    Evaluates textual records vs spatial parcel geometry and computes an explainable 0-100 Consistency Score.
    """

    def __init__(self, db: AsyncSession):
        self.db = db
        self.weights = settings.VERIFICATION_WEIGHTS

    async def evaluate_parcel(self, parcel_uid: str) -> Dict[str, Any]:
        # Fetch parcel spatial record
        p_res = await self.db.execute(select(Parcel).where(Parcel.parcel_uid == parcel_uid))
        parcel = p_res.scalar_one_or_none()
        if not parcel:
            raise ValueError(f"Parcel '{parcel_uid}' not found.")

        # Fetch all related demo records
        ror_res = await self.db.execute(select(RecordOfRights).where(RecordOfRights.parcel_uid == parcel_uid))
        ror = ror_res.scalar_one_or_none()

        reg_res = await self.db.execute(select(RegistrationRecord).where(RegistrationRecord.parcel_uid == parcel_uid))
        reg = reg_res.scalar_one_or_none()

        mut_res = await self.db.execute(select(MutationRecord).where(MutationRecord.parcel_uid == parcel_uid))
        mut = mut_res.scalar_one_or_none()

        enc_res = await self.db.execute(select(Encumbrance).where(Encumbrance.parcel_uid == parcel_uid, Encumbrance.status == "ACTIVE"))
        encumbrances = enc_res.scalars().all()

        dispute_res = await self.db.execute(select(CourtCase).where(CourtCase.parcel_uid == parcel_uid, CourtCase.status.in_(["PENDING", "STAY_ORDER"])))
        disputes = dispute_res.scalars().all()

        score = 100
        findings: List[Dict[str, Any]] = []

        # 1. Registration Record Check
        if not reg:
            deduction = self.weights["MISSING_REGISTRATION"]
            score -= deduction
            findings.append({
                "category": "REGISTRATION",
                "severity": "HIGH",
                "code": "MISSING_REGISTRATION",
                "message": "No deed registration record found in demo registry.",
                "score_impact": -deduction,
                "details": {"expected_parcel_uid": parcel_uid},
            })

        # 2. Record of Rights (RoR) Check
        if not ror:
            deduction = self.weights["MISSING_ROR"]
            score -= deduction
            findings.append({
                "category": "RECORD_OF_RIGHTS",
                "severity": "HIGH",
                "code": "MISSING_ROR",
                "message": "No Record of Rights (Jamabandi/Khatauni) record found in demo data.",
                "score_impact": -deduction,
                "details": {},
            })

        # 3. Area Consistency Check (Recorded RoR vs Spatial Calculated Area)
        if ror:
            diff_sq_m = abs(ror.area_recorded_sq_m - parcel.area_sq_m)
            percent_diff = (diff_sq_m / ror.area_recorded_sq_m) * 100.0 if ror.area_recorded_sq_m > 0 else 0
            if percent_diff > 5.0:  # > 5% mismatch
                deduction = self.weights["AREA_MISMATCH"]
                score -= deduction
                findings.append({
                    "category": "AREA_MATCH",
                    "severity": "MEDIUM",
                    "code": "AREA_MISMATCH",
                    "message": f"Recorded RoR area ({ror.area_recorded_sq_m:.1f} m²) differs from calculated spatial area ({parcel.area_sq_m:.1f} m²) by {percent_diff:.1f}%.",
                    "score_impact": -deduction,
                    "details": {
                        "recorded_area_sq_m": ror.area_recorded_sq_m,
                        "calculated_area_sq_m": parcel.area_sq_m,
                        "difference_percent": round(percent_diff, 2),
                    },
                })

        # 4. Mutation Status Check
        if mut and mut.status == "PENDING":
            deduction = self.weights["MUTATION_PENDING"]
            score -= deduction
            findings.append({
                "category": "MUTATION",
                "severity": "MEDIUM",
                "code": "MUTATION_PENDING",
                "message": f"Land mutation status is currently PENDING (Application Date: {mut.application_date.strftime('%Y-%m-%d')}).",
                "score_impact": -deduction,
                "details": {"mutation_id": mut.mutation_id, "status": mut.status},
            })

        # 5. Encumbrance Check
        if encumbrances:
            deduction = self.weights["ENCUMBRANCE_FOUND"]
            score -= deduction
            findings.append({
                "category": "ENCUMBRANCE",
                "severity": "HIGH",
                "code": "ENCUMBRANCE_ACTIVE",
                "message": f"Found {len(encumbrances)} active demo encumbrance/mortgage record(s).",
                "score_impact": -deduction,
                "details": [
                    {"encumbrance_id": e.encumbrance_id, "type": e.type, "bank": e.holder_bank_demo}
                    for e in encumbrances
                ],
            })

        # 6. Court / Dispute Check
        if disputes:
            deduction = self.weights["DISPUTE_ACTIVE"]
            score -= deduction
            findings.append({
                "category": "DISPUTE",
                "severity": "HIGH",
                "code": "COURT_DISPUTE_ACTIVE",
                "message": f"Found {len(disputes)} active litigation / stay order court case(s) in demo records.",
                "score_impact": -deduction,
                "details": [
                    {"case_id": d.case_id, "court": d.court_name, "status": d.status}
                    for d in disputes
                ],
            })

        # 7. Geometry Validity Check
        if not parcel.is_geometry_valid:
            deduction = self.weights["INVALID_GEOMETRY"]
            score -= deduction
            findings.append({
                "category": "SPATIAL_GEOMETRY",
                "severity": "CRITICAL",
                "code": "INVALID_GEOMETRY",
                "message": "Parcel spatial geometry contains self-intersections or invalid topology.",
                "score_impact": -deduction,
                "details": {},
            })

        # Final Score Bounding
        score = max(0, min(100, score))

        # Determine Final Status
        if not reg:
            final_status = "NO_REGISTRATION_RECORD_IN_DEMO_DATA"
        elif disputes or encumbrances or not parcel.is_geometry_valid:
            final_status = "MANUAL_REVIEW_REQUIRED"
        elif any(f["code"] == "AREA_MISMATCH" for f in findings) or (mut and mut.status == "PENDING"):
            final_status = "RECORD_MISMATCH"
        elif score >= 90:
            final_status = "VERIFIED_IN_DEMO_DATA"
        else:
            final_status = "POTENTIAL_CONFLICT"

        # Save or update verification result in DB
        v_id = f"VERIF-{parcel_uid}"
        existing_res = await self.db.execute(select(VerificationResult).where(VerificationResult.verification_id == v_id))
        verif = existing_res.scalar_one_or_none()

        if verif:
            verif.status = final_status
            verif.score = score
            verif.findings_json = findings
            verif.created_at = datetime.now(timezone.utc)
        else:
            verif = VerificationResult(
                verification_id=v_id,
                parcel_uid=parcel_uid,
                status=final_status,
                score=score,
                findings_json=findings,
                engine_version="verification-1.0",
                dataset_version=parcel.dataset_version,
                rules_version="rules-1.0",
            )
            self.db.add(verif)

        await self.db.flush()

        return {
            "verification_id": v_id,
            "parcel_uid": parcel_uid,
            "status": final_status,
            "score": score,
            "findings": findings,
            "engine_version": "verification-1.0",
            "dataset_version": parcel.dataset_version,
            "rules_version": "rules-1.0",
            "review_status": verif.review_status,
            "reviewer_remarks": verif.reviewer_remarks,
            "created_at": verif.created_at,
        }
