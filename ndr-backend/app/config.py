import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./ndr_threats.db")
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000,*")
    SIMULATION_INTERVAL_MS: int = int(os.getenv("SIMULATION_INTERVAL_MS", "1000"))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "production")

    @property
    def cors_origin_list(self) -> List[str]:
        if not self.CORS_ORIGINS:
            return ["*"]
        return [orig.strip() for orig in self.CORS_ORIGINS.split(",") if orig.strip()]

settings = Settings()
