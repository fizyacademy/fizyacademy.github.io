# app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, get_jwt_identity, get_jwt, verify_jwt_in_request
from config import Config, instance_dir
from db import db
from auth import auth_bp
from admin import admin_bp
from models import User, TokenBlocklist
from account import account_bp
from auth import oauth
from werkzeug.security import generate_password_hash
import os

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # تفعيل CORS للسماح بالكوكيز في بيئة التطوير
    CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

    # تهيئة قواعد البيانات و JWT
    db.init_app(app)
    oauth.init_app(app)
    jwt = JWTManager(app)

    # التحقق من إلغاء التوكن (Token Revoking)
    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        jti = jwt_payload["jti"]
        return db.session.query(TokenBlocklist.id).filter_by(jti=jti).first() is not None

    # حماية الوصول في حالة is_complete = False
    @app.before_request
    def restrict_incomplete_users():
        public_routes = [
            "/auth/login",
            "/auth/register",
            "/auth/google-login",
            "/auth/complete-profile",
            "/auth/refresh",
            "/auth/logout"
        ]

        if request.path in public_routes or request.path.startswith("/static"):
            return

        try:
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            if user_id:
                user = User.query.get(user_id)
                if user and not user.is_complete:
                    return jsonify({
                        "message": "يجب إكمال البيانات أولاً",
                        "redirect_to": "/complete-profile"
                    }), 403
        except Exception:
            # لو التوكن مش موجود أو فيه خطأ، بنسيبه يوصل للصفحة اللي هيشوفها بنفسه (زي login)
            pass

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
                is_approved=True,
                is_complete=True
            )
            db.session.add(default_admin)
            db.session.commit()

    return app

# إنشاء التطبيق وتشغيله محليًا
app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
