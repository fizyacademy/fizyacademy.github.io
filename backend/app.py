# app.py

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager, get_jwt
from config import Config
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

    CORS(app, supports_credentials=True)
    db.init_app(app)
    jwt = JWTManager(app)

    # ✅ التحقق من التوكنات الملغاة
    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        jti = jwt_payload["jti"]
        return db.session.query(TokenBlocklist.id).filter_by(jti=jti).first() is not None

    # تسجيل الـ Blueprints
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(admin_bp, url_prefix="/admin")
    app.register_blueprint(account_bp, url_prefix="/account")

    # إنشاء قاعدة البيانات + المدير الافتراضي
    with app.app_context():
        db.create_all()

        if not User.query.filter_by(username="admin").first():
            default_admin = User(
                username="admin",
                arabic_name="بكر محمد حسين",
                password=generate_password_hash(os.getenv("ADMIN_PASSWORD")),
                role="admin",
                gender="male",
                user_code="#00000001",
                is_approved=True
            )
            db.session.add(default_admin)
            db.session.commit()

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
