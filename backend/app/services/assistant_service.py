import re
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.parcel import Parcel
from app.services.verification_service import VerificationEngine


class BhoomiAssistantService:
    """
    AI Assistant tool with strict safety guardrails.
    Answers parcel and consistency queries using synthetic data tools only.
    """

    GUARDRAIL_PATTERNS = [
        r"who\s+(legally\s+)?owns\b",
        r"who\s+is\s+the\s+(legal\s+)?owner\b",
        r"is\s+this\s+(property|land)\s+(legally\s+)?safe\s+to\s+buy\b",
        r"can\s+i\s+buy\s+this\s+(property|land)\s+without\s+risk\b",
        r"guarantee\s+(title|ownership)\b",
        r"legal\s+title\s+proof\b",
    ]

    def __init__(self, db: AsyncSession):
        self.db = db

    async def process_query(self, user_message: str, parcel_context_uid: Optional[str] = None) -> Dict[str, Any]:
        msg_lower = user_message.lower()

        # 1. Evaluate Legal Guardrails
        for pattern in self.GUARDRAIL_PATTERNS:
            if re.search(pattern, msg_lower):
                return {
                    "reply": (
                        "I cannot determine legal ownership or guarantee title safety from this prototype. "
                        "This application uses synthetic demonstration data for system testing only. "
                        "Legal ownership, property title verification, and purchase safety require "
                        "authoritative government revenue/registry records and professional legal due diligence."
                    ),
                    "suggested_actions": [
                        "View Demo Record Consistency Score",
                        "Generate Demo Verification Checklist",
                        "Explore Parcel Spatial Geometry",
                    ],
                    "source_parcels": [parcel_context_uid] if parcel_context_uid else [],
                    "guardrail_applied": True,
                }

        # 2. Contextual Parcel Inquiry
        target_parcel_uid = parcel_context_uid
        if not target_parcel_uid:
            match = re.search(r"BV-[A-Z0-9-]+", user_message.upper())
            if match:
                target_parcel_uid = match.group(0)

        if target_parcel_uid:
            res = await self.db.execute(select(Parcel).where(Parcel.parcel_uid == target_parcel_uid))
            parcel = res.scalar_one_or_none()
            if parcel:
                engine = VerificationEngine(self.db)
                verif = await engine.evaluate_parcel(target_parcel_uid)

                reply = (
                    f"**Demo Intelligence for Parcel {parcel.parcel_uid}**:\n"
                    f"- **Location**: {parcel.village}, Tehsil {parcel.tehsil}, {parcel.district}, {parcel.state}\n"
                    f"- **Survey / Khasra No**: {parcel.survey_number or 'N/A'} / {parcel.khasra_number or 'N/A'}\n"
                    f"- **Spatial Calculated Area**: {parcel.area_sq_m:.1f} m² ({parcel.area_sq_m / 4046.86:.3f} acres)\n"
                    f"- **Demo Record Consistency Score**: **{verif['score']}/100** ({verif['status']})\n\n"
                )
                if verif["findings"]:
                    reply += "**Detected Demo Findings**:\n"
                    for f in verif["findings"]:
                        reply += f"- **{f['code']}**: {f['message']}\n"
                else:
                    reply += "All synthetic records (RoR, Registration, Spatial) are consistent in demo data.\n"

                return {
                    "reply": reply,
                    "suggested_actions": [
                        f"Run Verification for {target_parcel_uid}",
                        f"Generate PDF Report for {target_parcel_uid}",
                        "Measure Land Polygon",
                    ],
                    "source_parcels": [target_parcel_uid],
                    "guardrail_applied": False,
                }

        # 3. General Platform Intent
        if "mismatch" in msg_lower or "conflict" in msg_lower:
            return {
                "reply": (
                    "BhoomiVerify highlights 10 synthetic record mismatch scenarios, such as when recorded "
                    "RoR area differs from spatial geometry area, or when registration status is missing. "
                    "You can filter parcels by 'Record Mismatch' in the Map Explorer sidebar."
                ),
                "suggested_actions": ["Filter Mismatched Demo Parcels", "Open Map Explorer"],
                "source_parcels": [],
                "guardrail_applied": False,
            }

        return {
            "reply": (
                "Welcome to BhoomiVerify! I am Bhoomi Assistant. You can ask me to analyze any demo parcel by UID "
                "(e.g., 'Analyze BV-MH-PUN-00101'), explain consistency scores, or summarize demo record mismatches."
            ),
            "suggested_actions": ["Search Demo Parcels", "Explore Demo Map", "View Help"],
            "source_parcels": [],
            "guardrail_applied": False,
        }
