"""Application configuration using pydantic-settings."""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database
    database_url: str

    # Authentication
    better_auth_secret: str
    better_auth_url: str = "http://localhost:8000"

    # CORS
    frontend_url: str = "http://localhost:3000"

    # App settings
    app_name: str = "Todo API"
    debug: bool = False

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
