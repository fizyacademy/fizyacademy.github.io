# auth.py
import os
import random
from datetime import datetime
from flask import Blueprint, request, jsonify, redirect, url_for, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    set_refresh_cookies,
    get_jwt,
    current_user
)
from authlib.integrations.flask_client import OAuth
from models import User, TokenBlocklist
from db import db

auth_bp = Blueprint("auth", __name__)
oauth = OAuth()  # سيتم تهيئته في app.py

def get_google_client():
    return current_app.extensions["authlib.integrations.flask_client"]._clients["google"]

# ------------------ Helpers ------------------
def generate_coupon_code(username):
    base = username[:5].lower()
    while True:
        suffix = str(random.randint(1000, 9999))
        coupon = base + suffix
        if not User.query.filter_by(coupon_code=coupon).first():
            return coupon

def generate_unique_user_code():
    while True:
        code = "#" + str(random.randint(10000000, 99999999))
        if not User.query.filter_by(user_code=code).first():
            return code

# ------------------ Google OAuth ------------------
@auth_bp.route("/google-link")
@jwt_required()
def google_link():
    redirect_uri = url_for("auth.google_link_callback", _external=True)
    return get_google_client().authorize_redirect(redirect_uri)

@auth_bp.route("/google-link/callback")
@jwt_required()
def google_link_callback():
    token = get_google_client().authorize_access_token()
    userinfo = get_google_client().get("https://openidconnect.googleapis.com/v1/userinfo").json()
    google_id = userinfo["sub"]
    google_email = userinfo.get("email")

    # لو فيه حساب تاني أصلاً رابط نفس Google ID
    if User.query.filter(User.google_id == google_id, User.id != get_jwt_identity()).first():
        return jsonify({"message": "هذا الحساب في جوجل مرتبط بالفعل بحساب آخر"}), 400

    # لو فيه حساب تاني بنفس Google Email
    if User.query.filter(User.google_email == google_email, User.id != get_jwt_identity()).first():
        return jsonify({"message": "هذا البريد في جوجل مربوط بالفعل بحساب آخر"}), 400

    user = User.query.get(get_jwt_identity())
    if user.google_id:
        return jsonify({"message": "هذا الحساب مرتبط بالفعل بجوجل"}), 400

    user.google_id = google_id
    user.google_email = google_email
    db.session.commit()

    return jsonify({"message": "تم ربط حساب جوجل بنجاح"})

@auth_bp.route('/auth/unlink-google', methods=['POST'])
@jwt_required()
def unlink_google():
    if not current_user.google_id:
        return jsonify({"message": "لا يوجد حساب جوجل مربوط"}), 400
    
    current_user.google_id = None
    db.session.commit()
    return jsonify({"message": "تم إلغاء الربط بنجاح"})

@auth_bp.route("/google-login")
def google_login():
    redirect_uri = url_for("auth.google_login_callback", _external=True)
    return get_google_client().authorize_redirect(redirect_uri)

@auth_bp.route("/google-login/callback")
def google_login_callback():
    token = get_google_client().authorize_access_token()
    userinfo = get_google_client().get("https://openidconnect.googleapis.com/v1/userinfo").json()
    google_id = userinfo["sub"]

    user = User.query.filter_by(google_id=google_id).first()
    if not user:
        return jsonify({"message": "هذا الحساب في جوجل غير مربوط بأي حساب لدينا"}), 404

    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)

    response = redirect("http://localhost:5173/")
    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)
    return response

# ------------------ Auth Endpoints ------------------
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"message": "اسم المستخدم موجود بالفعل"}), 400

    if data.get("email") and User.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "البريد الإلكتروني مستخدم بالفعل"}), 400

    if data.get("student_phone") and User.query.filter_by(student_phone=data["student_phone"]).first():
        return jsonify({"message": "رقم الطالب مستخدم بالفعل"}), 400

    if data.get("father_phone") and data.get("student_phone"):
        if data["student_phone"] == data["father_phone"]:
            return jsonify({"message": "رقم الطالب لا يجب أن يطابق رقم ولي الأمر"}), 400

    if len(data["password"]) < 6:
        return jsonify({"message": "كلمة المرور يجب أن تكون على الأقل 6 أحرف"}), 400

    hashed_password = generate_password_hash(data["password"])
    coupon = generate_coupon_code(data["username"])
    user_code = generate_unique_user_code()
    referred_by = data.get("referred_by")

    gender = data.get("gender", "male")
    default_avatar = "boy_1" if gender == "male" else "girl_1"

    new_user = User(
        username=data["username"],
        arabic_name=data.get("arabic_name", ""),
        email=data.get("email"),
        password=hashed_password,
        role=data.get("role", "student"),
        stage=data.get("stage"),
        student_phone=data.get("student_phone"),
        father_phone=data.get("father_phone"),
        coupon_code=coupon,
        user_code=user_code,
        referred_by=referred_by,
        points=0,
        gender=gender,
        avatar=default_avatar,
        is_approved=True if data.get("role", "student") == "student" or data["username"] == "admin" else False,
        is_complete=True
    )

    db.session.add(new_user)

    if referred_by:
        referrer = User.query.filter_by(coupon_code=referred_by).first()
        if referrer:
            referrer.points += 1

    db.session.commit()
    return jsonify({"message": "تم التسجيل بنجاح"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    identifier = data.get("username")
    password = data.get("password")

    user = (
        User.query.filter_by(username=identifier).first()
        or User.query.filter_by(email=identifier).first()
        or User.query.filter_by(student_phone=identifier).first()
    )

    if not user or not check_password_hash(user.password, password):
        return jsonify({"message": "بيانات الدخول غير صحيحة"}), 401

    if not user.is_approved:
        return jsonify({"message": "لم يتم الموافقة على الحساب بعد"}), 403

    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)

    response = jsonify({
        "message": "تم تسجيل الدخول بنجاح",
        "user": user.to_dict()
    })

    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)
    return response, 200

@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh_token():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)

    response = jsonify({"message": "تم تجديد التوكن بنجاح"})
    set_access_cookies(response, access_token)
    return response

@auth_bp.route("/logout", methods=["POST"])
@jwt_required(verify_type=False)
def logout():
    jwt_data = get_jwt()
    jti = jwt_data["jti"]
    token_type = jwt_data["type"]

    db.session.add(TokenBlocklist(jti=jti, created_at=datetime.utcnow()))

    if token_type == "access":
        refresh_token = request.cookies.get("refresh_token")
        if refresh_token:
            from flask_jwt_extended import decode_token
            try:
                decoded_refresh = decode_token(refresh_token)
                db.session.add(TokenBlocklist(jti=decoded_refresh["jti"], created_at=datetime.utcnow()))
            except Exception:
                pass

    db.session.commit()

    response = jsonify({"message": "تم تسجيل الخروج بنجاح"})
    response.set_cookie("access_token", "", max_age=0, expires=0, path="/", httponly=True)
    response.set_cookie("refresh_token", "", max_age=0, expires=0, path="/auth/refresh", httponly=True)
    response.set_cookie("csrf_access", "", max_age=0, expires=0, path="/")
    response.set_cookie("csrf_refresh", "", max_age=0, expires=0, path="/auth/refresh")

    return response, 200

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"message": "المستخدم غير موجود"}), 404
    return jsonify({"user": user.to_dict()})
