import os
import sys
import random
import math
from datetime import datetime, timedelta, timezone

# Add parent directory to path so app modules import properly
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.core.database import sync_engine, Base
from app.core.security import hash_password
from app.models.user import User
from app.models.role import UserRole
from app.models.parcel import Parcel
from app.models.record_of_rights import RecordOfRights
from app.models.registration_record import RegistrationRecord
from app.models.mutation_record import MutationRecord
from app.models.encumbrance import Encumbrance
from app.models.court_case import CourtCase
from app.models.verification import DatasetVersion, VerificationResult
from app.utils.gis_units import calculate_geodesic_area_sq_m, calculate_geodesic_perimeter_m

# Demo Locations
LOCATIONS = [
    {"state": "Maharanya", "district": "Pune Demo", "tehsil": "Haveli", "village": "Wagholi Demo", "base_lat": 18.5789, "base_lng": 73.9785, "prefix": "MH-PUN"},
    {"state": "Uttar Pradesh Demo", "district": "Lucknow Demo", "tehsil": "Bakshi Ka Talab", "village": "Chandpur Demo", "base_lat": 26.9850, "base_lng": 80.9520, "prefix": "UP-LKO"},
    {"state": "Karnapur", "district": "Bengaluru Rural", "tehsil": "Devanahalli", "village": "Avathi Demo", "base_lat": 13.2500, "base_lng": 77.7100, "prefix": "KA-BLR"},
    {"state": "Rajasthan Demo", "district": "Jaipur Demo", "tehsil": "Sanganer", "village": "Watika Demo", "base_lat": 26.7800, "base_lng": 75.8200, "prefix": "RJ-JPR"},
]

FIRST_NAMES = ["Aarav", "Rajesh", "Priya", "Sunita", "Vikram", "Ananya", "Ramesh", "Suresh", "Kavita", "Amit"]
LAST_NAMES = ["Sharma", "Patil", "Verma", "Rao", "Joshi", "Deshmukh", "Singh", "Gupta", "Yadav", "Kulkarni"]


def generate_polygon(center_lat: float, center_lng: float, size_deg: float = 0.001) -> list:
    """Generates a simple 5-vertex polygon around a center coordinate."""
    r = size_deg
    angles = [0, 72, 144, 216, 288]
    coords = []
    for angle in angles:
        rad = math.radians(angle)
        jitter_r = r * (0.8 + 0.4 * random.random())
        lng = center_lng + jitter_r * math.cos(rad)
        lat = center_lat + jitter_r * math.sin(rad)
        coords.append((round(lng, 6), round(lat, 6)))
    coords.append(coords[0])  # close ring
    return coords


def seed_demo_dataset():
    print("Initializing BhoomiVerify Synthetic Demo Database Seed...")
    random.seed(2026)

    Base.metadata.create_all(bind=sync_engine)

    with Session(sync_engine) as session:
        # 1. Seed Demo Users
        demo_users = [
            {"email": "public@bhoomiverify.demo", "pass": "public123", "name": "Public Demo User", "role": UserRole.PUBLIC},
            {"email": "buyer@bhoomiverify.demo", "pass": "buyer123", "name": "Prospective Buyer User", "role": UserRole.BUYER},
            {"email": "reviewer@bhoomiverify.demo", "pass": "reviewer123", "name": "Government Reviewer User", "role": UserRole.REVIEWER},
            {"email": "admin@bhoomiverify.demo", "pass": "admin123", "name": "System Administrator", "role": UserRole.ADMIN},
            {"email": "superadmin@bhoomiverify.demo", "pass": "super123", "name": "Super Admin User", "role": UserRole.SUPER_ADMIN},
        ]
        for u_data in demo_users:
            existing = session.query(User).filter_by(email=u_data["email"]).first()
            if not existing:
                u = User(
                    email=u_data["email"],
                    hashed_password=hash_password(u_data["pass"]),
                    full_name=u_data["name"],
                    role=u_data["role"],
                    is_superuser=(u_data["role"] == UserRole.SUPER_ADMIN),
                )
                session.add(u)

        session.commit()

        # 2. Dataset Version
        existing_version = session.query(DatasetVersion).filter_by(version_tag="demo-2026.01").first()
        if not existing_version:
            ds = DatasetVersion(
                version_tag="demo-2026.01",
                description="Initial synthetic demonstration dataset covering parcels across 4 states.",
                checksum="syn-seed-2026-sha256-demo",
                total_parcels=500,
                status="PUBLISHED",
            )
            session.add(ds)
            session.commit()

        print("Generating 200 Synthetic Demo Parcels with all 10 Data Quality Scenarios...")

        parcels_created = 0
        grid_rows = 10
        grid_cols = 5

        for loc in LOCATIONS:
            state_name = loc["state"]
            dist_name = loc["district"]
            tehsil_name = loc["tehsil"]
            village_name = loc["village"]
            base_lat = loc["base_lat"]
            base_lng = loc["base_lng"]
            prefix = loc["prefix"]

            for r in range(grid_rows):
                for c in range(grid_cols):
                    parcels_created += 1
                    parcel_uid = f"BV-{prefix}-{parcels_created:05d}"
                    survey_no = f"{100 + r}/{c + 1}"
                    khasra_no = f"KH-{200 + r*c}"
                    khata_no = f"KT-{50 + (parcels_created % 30)}"

                    c_lat = base_lat + (r * 0.002) + (random.uniform(-0.0002, 0.0002))
                    c_lng = base_lng + (c * 0.002) + (random.uniform(-0.0002, 0.0002))

                    coords = generate_polygon(c_lat, c_lng)
                    area_sq_m = calculate_geodesic_area_sq_m(coords)
                    perimeter_m = calculate_geodesic_perimeter_m(coords)

                    lngs = [p[0] for p in coords]
                    lats = [p[1] for p in coords]

                    geojson_geometry = {
                        "type": "MultiPolygon",
                        "coordinates": [[coords]],
                    }

                    scenario = (parcels_created % 10) + 1

                    is_geometry_valid = True
                    if scenario == 4:  # Geometry Mismatch scenario
                        is_geometry_valid = False

                    existing_p = session.query(Parcel).filter_by(parcel_uid=parcel_uid).first()
                    if not existing_p:
                        parcel = Parcel(
                            parcel_uid=parcel_uid,
                            state=state_name,
                            district=dist_name,
                            tehsil=tehsil_name,
                            village=village_name,
                            survey_number=survey_no,
                            khasra_number=khasra_no,
                            plot_number=f"PLOT-{parcels_created}",
                            khata_number=khata_no,
                            parcel_type="AGRICULTURAL" if (parcels_created % 2 == 0) else "RESIDENTIAL",
                            land_use="Agricultural" if (parcels_created % 2 == 0) else "Residential",
                            geometry_geojson=geojson_geometry,
                            centroid_lat=round(c_lat, 6),
                            centroid_lng=round(c_lng, 6),
                            bbox_xmin=min(lngs),
                            bbox_ymin=min(lats),
                            bbox_xmax=max(lngs),
                            bbox_ymax=max(lats),
                            area_sq_m=area_sq_m,
                            perimeter_m=perimeter_m,
                            is_geometry_valid=is_geometry_valid,
                            source_dataset="synthetic_demo_v1",
                            dataset_version="demo-2026.01",
                        )
                        session.add(parcel)

                        holder_name = f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)} (DEMO)"
                        seller_name = f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)} (DEMO)"

                        if scenario != 9:
                            recorded_area = area_sq_m
                            if scenario == 3:  # Area Mismatch
                                recorded_area = area_sq_m * 1.15

                            ror = RecordOfRights(
                                parcel_uid=parcel_uid,
                                record_id=f"ROR-{parcel_uid}",
                                holder_name_demo=holder_name,
                                land_use=parcel.land_use,
                                area_recorded_sq_m=round(recorded_area, 2),
                                khata_number=khata_no,
                                khasra_survey_number=khasra_no,
                                status="ACTIVE",
                            )
                            session.add(ror)

                        if scenario not in [2, 9]:
                            reg = RegistrationRecord(
                                parcel_uid=parcel_uid,
                                registration_id=f"REG-{parcel_uid}",
                                document_number=f"DOC-2025/{parcels_created:04d}",
                                registration_date=datetime.now(timezone.utc) - timedelta(days=random.randint(30, 700)),
                                transaction_type="SALE_DEED",
                                seller_demo=seller_name,
                                buyer_demo=holder_name,
                                registered_area_sq_m=area_sq_m,
                                status="REGISTERED",
                            )
                            session.add(reg)

                        mut_status = "COMPLETED"
                        if scenario == 5:
                            mut_status = "PENDING"
                        
                        mut = MutationRecord(
                            parcel_uid=parcel_uid,
                            mutation_id=f"MUT-{parcel_uid}",
                            mutation_type="SALE_MUTATION",
                            applicant_demo=holder_name,
                            application_date=datetime.now(timezone.utc) - timedelta(days=15),
                            status=mut_status,
                            remarks="Pending Tahsildar signature verification." if mut_status == "PENDING" else "Mutation sanctioned.",
                        )
                        session.add(mut)

                        if scenario == 6:
                            enc = Encumbrance(
                                parcel_uid=parcel_uid,
                                encumbrance_id=f"ENC-{parcel_uid}",
                                type="MORTGAGE_LIEN",
                                holder_bank_demo="State Bank Demo",
                                status="ACTIVE",
                                date_created=datetime.now(timezone.utc) - timedelta(days=200),
                                source_reference="BANK-REF-9921",
                            )
                            session.add(enc)

                        if scenario == 7:
                            cc = CourtCase(
                                parcel_uid=parcel_uid,
                                case_id=f"CASE-{parcel_uid}",
                                court_name="Civil Court Senior Division Demo",
                                case_type="TITLE_BOUNDARY_DISPUTE",
                                status="STAY_ORDER",
                                filing_date=datetime.now(timezone.utc) - timedelta(days=120),
                                details="Interim injunction stay order granted regarding boundary line.",
                            )
                            session.add(cc)

        session.commit()
        print(f"Successfully seeded {parcels_created} synthetic parcels into database.")


if __name__ == "__main__":
    seed_demo_dataset()
