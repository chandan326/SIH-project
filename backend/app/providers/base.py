from abc import ABC, abstractmethod
from typing import Optional, Dict, Any, List


class LandRecordProvider(ABC):
    """Abstract interface for fetching Record of Rights (RoR / Jamabandi / Khatauni)."""

    @abstractmethod
    async def get_ror_by_parcel_uid(self, parcel_uid: str) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    async def search_ror_by_khasra(self, village: str, khasra_number: str) -> List[Dict[str, Any]]:
        pass


class RegistrationProvider(ABC):
    """Abstract interface for fetching deed registration records."""

    @abstractmethod
    async def get_registration_by_parcel_uid(self, parcel_uid: str) -> Optional[Dict[str, Any]]:
        pass


class MutationProvider(ABC):
    """Abstract interface for fetching land mutation logs."""

    @abstractmethod
    async def get_mutation_by_parcel_uid(self, parcel_uid: str) -> Optional[Dict[str, Any]]:
        pass


class CadastralProvider(ABC):
    """Abstract interface for fetching cadastral spatial parcel geometries."""

    @abstractmethod
    async def get_cadastral_geometry(self, parcel_uid: str) -> Optional[Dict[str, Any]]:
        pass
