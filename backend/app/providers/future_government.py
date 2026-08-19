from typing import Optional, Dict, Any, List
from app.providers.base import (
    LandRecordProvider,
    RegistrationProvider,
    MutationProvider,
    CadastralProvider,
)


class FutureGovernmentLandRecordProvider(
    LandRecordProvider, RegistrationProvider, MutationProvider, CadastralProvider
):
    """
    Adapter template for future production integration with state / central government APIs
    (e.g., DILRMP API, State Revenue Dept API, Sub-Registrar Office portal).
    """

    def __init__(self, api_endpoint: str, api_key: str):
        self.api_endpoint = api_endpoint
        self.api_key = api_key

    async def get_ror_by_parcel_uid(self, parcel_uid: str) -> Optional[Dict[str, Any]]:
        raise NotImplementedError(
            "Future Government API Adapter: Connection to live state revenue servers "
            "is not configured in this synthetic prototype."
        )

    async def search_ror_by_khasra(self, village: str, khasra_number: str) -> List[Dict[str, Any]]:
        raise NotImplementedError("Future Government API Adapter: Not configured in synthetic prototype.")

    async def get_registration_by_parcel_uid(self, parcel_uid: str) -> Optional[Dict[str, Any]]:
        raise NotImplementedError("Future Government API Adapter: Not configured in synthetic prototype.")

    async def get_mutation_by_parcel_uid(self, parcel_uid: str) -> Optional[Dict[str, Any]]:
        raise NotImplementedError("Future Government API Adapter: Not configured in synthetic prototype.")

    async def get_cadastral_geometry(self, parcel_uid: str) -> Optional[Dict[str, Any]]:
        raise NotImplementedError("Future Government API Adapter: Not configured in synthetic prototype.")
