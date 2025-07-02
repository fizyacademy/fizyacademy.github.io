# app.py

from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from db import db
from auth import auth_bp
from admin import admin_bp
from models import User
from account import account_bp
from werkzeug.security import generate_password_hash
import os

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, supports_credentials=True)
    db.init_app(app)
    JWTManager(app)

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
                password=generate_password_hash("admin"),
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
