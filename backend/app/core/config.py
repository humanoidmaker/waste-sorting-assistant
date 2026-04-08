from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    APP_NAME: str = "EcoSort - Waste Sorting Assistant"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    HOST: str = "0.0.0.0"
    PORT: int = 8002
    ALLOWED_ORIGINS: str = "http://localhost:3002,http://localhost:5175"

    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB: str = "ecosort"

    SECRET_KEY: str = "ecosort-secret-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAIL_FROM: str = "noreply@ecosort.ai"
    EMAIL_FROM_NAME: str = "EcoSort"

    MODEL_PATH: str = "models/waste_classifier.pth"
    DEVICE: str = "cuda"
    CONFIDENCE_THRESHOLD: float = 0.5

    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024
    UPLOAD_DIR: str = "uploads"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
