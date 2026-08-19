from fastapi import APIRouter
from app.api.v1 import (
    auth,
    parcels,
    verification,
    measurements,
    reports,
    admin,
    assistant,
    health,
)

api_v1_router = APIRouter()

api_v1_router.include_router(auth.router)
api_v1_router.include_router(parcels.router)
api_v1_router.include_router(verification.router)
api_v1_router.include_router(measurements.router)
api_v1_router.include_router(reports.router)
api_v1_router.include_router(admin.router)
api_v1_router.include_router(assistant.router)
api_v1_router.include_router(health.router)
