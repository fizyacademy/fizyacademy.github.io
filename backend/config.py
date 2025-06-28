import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)

    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_COOKIE_SECURE = False  # ❗️خليها True في الإنتاج مع HTTPS
    JWT_COOKIE_SAMESITE = "Lax"
    JWT_COOKIE_CSRF_PROTECT = False  # ❗️فعلها لاحقًا
    JWT_ACCESS_COOKIE_PATH = "/"
