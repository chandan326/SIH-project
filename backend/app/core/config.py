import os
from typing import Dict, Any, List
from pydantic_settings import BaseSettings, SettingsConfigDict

# Ensure database path always resolves inside backend/
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SQLITE_DB_PATH = os.path.join(BACKEND_DIR, "bhoomiverify_demo.db")


class Settings(BaseSettings):
    # Application Configuration
    PROJECT_NAME: str = "BhoomiVerify"
    TAGLINE: str = "Mapping Land. Connecting Records. Improving Transparency."
    DEMO_DISCLAIMER: str = (
        "This prototype uses synthetic demonstration data and does not establish legal "
        "ownership, title, registration status, or encumbrance of any real property."
    )
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"

    # Database Settings (Supports both PostgreSQL+PostGIS and SQLite for local development)
    USE_SQLITE: bool = True
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_USER: str = "bhoomi"
    POSTGRES_PASSWORD: str = "bhoomipass123"
    POSTGRES_DB: str = "bhoomiverify_db"

    @property
    def DATABASE_URL(self) -> str:
        if self.USE_SQLITE:
            return f"sqlite+aiosqlite:///{SQLITE_DB_PATH}"
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    @property
    def SYNC_DATABASE_URL(self) -> str:
        if self.USE_SQLITE:
            return f"sqlite:///{SQLITE_DB_PATH}"
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # Redis Cache & Task Queue
    REDIS_URL: str = "redis://localhost:6379/0"

    # Security & Auth
    JWT_SECRET: str = "bhoomi-super-secret-key-change-in-prod-2026"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS Origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
    ]

    # Google Maps API
    GOOGLE_MAPS_API_KEY: str = ""

    # Storage (S3 / MinIO)
    S3_ENDPOINT: str = "http://localhost:9000"
    S3_ACCESS_KEY: str = "minioadmin"
    S3_SECRET_KEY: str = "minioadmin"
    S3_BUCKET: str = "bhoomiverify-documents"

    # Verification Weights Configuration
    VERIFICATION_WEIGHTS: Dict[str, int] = {
        "MISSING_REGISTRATION": 25,
        "MISSING_ROR": 20,
        "AREA_MISMATCH": 15,
        "MUTATION_PENDING": 10,
        "ENCUMBRANCE_FOUND": 15,
        "DISPUTE_ACTIVE": 20,
        "SPATIAL_OVERLAP": 20,
        "INVALID_GEOMETRY": 30,
        "INCOMPLETE_FIELDS": 10,
    }

    # Default Regional Land Unit Conversions (Multipliers to Sq. Meters)
    REGIONAL_UNIT_CONVERSIONS: Dict[str, Dict[str, float]] = {
        "Maharanya": {
            "guntha": 101.17,      # 1 Guntha = ~101.17 sq.m
            "bigha": 2500.0,      # Standard Bigha = 2500 sq.m
            "acre": 4046.86,
            "hectare": 10000.0,
        },
        "Uttar Pradesh Demo": {
            "bigha": 2529.3,       # UP Pucca Bigha = ~2529.3 sq.m
            "biswa": 126.46,       # 1/20 of Bigha
            "decimal": 40.4686,
            "acre": 4046.86,
            "hectare": 10000.0,
        },
        "Karnapur": {
            "guntha": 101.17,
            "cents": 40.4686,
            "acre": 4046.86,
            "hectare": 10000.0,
        },
        "Rajasthan Demo": {
            "bigha": 2722.5,       # Rajasthan Bigha = ~2722.5 sq.m
            "biswa": 136.125,
            "acre": 4046.86,
            "hectare": 10000.0,
        },
    }

    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        extra="ignore"
    )


settings = Settings()
