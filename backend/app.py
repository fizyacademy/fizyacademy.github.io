# app.py

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager, get_jwt
from config import Config, instance_dir
from db import db
from auth import auth_bp
from admin import admin_bp
from models import User, TokenBlocklist
from account import account_bp
from werkzeug.security import generate_password_hash
import os

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # تفعيل CORS للسماح بالكوكيز في بيئة التطوير
    CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

    # تهيئة قواعد البيانات و JWT
    db.init_app(app)
    jwt = JWTManager(app)

    # التحقق من إلغاء التوكن (Token Revoking)
    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        jti = jwt_payload["jti"]
        return db.session.query(TokenBlocklist.id).filter_by(jti=jti).first() is not None

    # تسجيل الـ Blueprints
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(admin_bp, url_prefix="/admin")
    app.register_blueprint(account_bp, url_prefix="/account")

    # إنشاء مجلد قاعدة البيانات إن لم يكن موجود
    os.makedirs(instance_dir, exist_ok=True)

    # إنشاء قاعدة البيانات + إضافة مسؤول افتراضي
    with app.app_context():
        db.create_all()

        if not User.query.filter_by(username="admin").first():
            default_admin = User(
                username="admin",
                arabic_name="بكر محمد حسين",
                password=generate_password_hash(os.getenv("ADMIN_PASSWORD")),
                role="admin",
                gender="male",
                avatar="boy_1",
                user_code="#00000001",
                is_approved=True
            )
            db.session.add(default_admin)
            db.session.commit()

    return app

# إنشاء التطبيق وتشغيله محليًا
app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
