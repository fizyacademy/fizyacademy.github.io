import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

basedir = os.path.abspath(os.path.dirname(__file__))
instance_dir = os.path.join(os.path.dirname(basedir), "instance")

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY")

    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{os.path.join(instance_dir, 'database.db')}"
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = SECRET_KEY

    # ✅ Access Token مدة قصيرة (15 دقيقة مثل المواقع الكبيرة)
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)

    # ✅ Refresh Token يدوم لأسبوع
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)

    # ✅ نستخدم الكوكيز لتخزين التوكنات
    JWT_TOKEN_LOCATION = ["cookies"]

    # ⚠️ فقط في الإنتاج: شغّل Secure + CSRF
    JWT_COOKIE_SECURE = False         # True في production
    JWT_COOKIE_SAMESITE = "Lax"
    JWT_COOKIE_CSRF_PROTECT = True    # ✅ ضروري لحماية الكوكيز
    JWT_ACCESS_COOKIE_PATH = "/"
    JWT_REFRESH_COOKIE_PATH = "/auth/refresh"  # تحديد مسار مخصص لـ refresh token

    JWT_ACCESS_CSRF_HEADER_NAME = "X-CSRF-TOKEN"
    JWT_REFRESH_CSRF_HEADER_NAME = "X-CSRF-TOKEN"

    # ✅ دعم Blacklist (revoked tokens)
    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ["access", "refresh"]
