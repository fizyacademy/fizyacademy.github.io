# config.py

import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

basedir = os.path.abspath(os.path.dirname(__file__))
instance_dir = os.path.join(basedir, "instance")
os.makedirs(instance_dir, exist_ok=True)

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")

    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{os.path.join(instance_dir, 'database.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = SECRET_KEY

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)

    JWT_TOKEN_LOCATION = ["cookies"]

    # أسماء جديدة للكوكيز
    JWT_ACCESS_COOKIE_NAME = "access_token"
    JWT_REFRESH_COOKIE_NAME = "refresh_token"
    JWT_ACCESS_CSRF_COOKIE_NAME = "csrf_access"
    JWT_REFRESH_CSRF_COOKIE_NAME = "csrf_refresh"

    # خصائص الكوكيز
    JWT_COOKIE_SECURE = False
    JWT_COOKIE_SAMESITE = "Lax"
    JWT_COOKIE_CSRF_PROTECT = True
    JWT_ACCESS_COOKIE_PATH = "/"
    JWT_REFRESH_COOKIE_PATH = "/auth/refresh"

    JWT_ACCESS_CSRF_HEADER_NAME = "X-CSRF-TOKEN"
    JWT_REFRESH_CSRF_HEADER_NAME = "X-CSRF-TOKEN"

    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ["access", "refresh"]

Config.instance_dir = instance_dir
