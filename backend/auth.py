# auth.py
import os
import random
from datetime import datetime
from flask import Blueprint, request, jsonify, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    set_refresh_cookies,
    get_jwt
)
from authlib.integrations.flask_client import OAuth
from models import User, TokenBlocklist
from db import db

auth_bp = Blueprint("auth", __name__)
oauth = OAuth()
google = oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)


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

@auth_bp.route("google-login")
def google_login_redirect():
    redirect_uri = url_for("auth.google_callback", _external=True)
    return google.authorize_redirect(redirect_uri)

@auth_bp.route("google-callback")
def google_callback():
    try:
        token = google.authorize_access_token()
        resp = google.get("userinfo")
        user_info = resp.json()
        email = user_info.get("email")
        name = user_info.get("name")

        if not email:
            return jsonify({"message": "لم يتم الحصول على البريد الإلكتروني"}), 400

        user = User.query.filter_by(email=email).first()

        if not user:
            return redirect(f"http://localhost:5173/complete-profile?email={email}&name={name}")

        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)

        response = redirect("http://localhost:5173/")
        set_access_cookies(response, access_token)
        set_refresh_cookies(response, refresh_token)
        return response

    except Exception as e:
        return jsonify({"message": "حدث خطأ أثناء تسجيل الدخول بجوجل", "error": str(e)}), 500

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

@auth_bp.route("/complete-profile", methods=["POST"])
@jwt_required()
def complete_profile():
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"message": "المستخدم غير موجود"}), 404

    if user.is_complete:
        return jsonify({"message": "تم إكمال البيانات مسبقًا"}), 400

    data = request.get_json()
    username = data.get("username")
    arabic_name = data.get("arabic_name")
    password = data.get("password")
    student_phone = data.get("student_phone")
    role = data.get("role")
    gender = data.get("gender", "male")

    if not username or not arabic_name or not student_phone or not role:
        return jsonify({"message": "جميع الحقول مطلوبة"}), 400

    if User.query.filter(User.username == username, User.id != user.id).first():
        return jsonify({"message": "اسم المستخدم مستخدم بالفعل"}), 400

    if User.query.filter(User.student_phone == student_phone, User.id != user.id).first():
        return jsonify({"message": "رقم الهاتف مستخدم بالفعل"}), 400

    user.username = username
    user.arabic_name = arabic_name
    user.student_phone = student_phone
    user.role = role
    user.gender = gender
    user.avatar = "boy_1" if gender == "male" else "girl_1"
    user.is_complete = True

    if password:
        if len(password) < 6:
            return jsonify({"message": "كلمة المرور قصيرة جدًا"}), 400
        user.password = generate_password_hash(password)

    db.session.commit()
    return jsonify({"message": "تم إكمال البيانات بنجاح", "user": user.to_dict()}), 200

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
