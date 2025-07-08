# auth.py

from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies,
    get_jwt
)
from models import User, TokenBlocklist
from db import db
import random
from datetime import datetime

auth_bp = Blueprint("auth", __name__)

# ✅ توليد كوبون فريد
def generate_coupon_code(username):
    base = username[:5].lower()
    while True:
        suffix = str(random.randint(1000, 9999))
        coupon = base + suffix
        if not User.query.filter_by(coupon_code=coupon).first():
            return coupon

# ✅ توليد كود مستخدم فريد
def generate_unique_user_code():
    while True:
        code = "#" + str(random.randint(10000000, 99999999))
        if not User.query.filter_by(user_code=code).first():
            return code

# ✅ تسجيل مستخدم جديد
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
        if data.get("student_phone") == data.get("father_phone"):
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
        is_approved=True if data.get("role", "student") == "student" or data["username"] == "admin" else False
    )

    db.session.add(new_user)

    if referred_by:
        referrer = User.query.filter_by(coupon_code=referred_by).first()
        if referrer:
            referrer.points += 1

    db.session.commit()
    return jsonify({"message": "تم التسجيل بنجاح"}), 201

# ✅ تسجيل الدخول: Access + Refresh + Cookies
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data["username"]).first()

    if not user or not check_password_hash(user.password, data["password"]):
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

# ✅ تجديد التوكن باستخدام Refresh Token
@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh_token():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)

    response = jsonify({"message": "تم تجديد التوكن بنجاح"})
    set_access_cookies(response, access_token)
    return response

# ✅ تسجيل الخروج بطريقة مضمونة
@auth_bp.route("/logout", methods=["POST"])
@jwt_required(verify_type=False)
def logout():
    jti = get_jwt()["jti"]
    db.session.add(TokenBlocklist(jti=jti, created_at=datetime.utcnow()))
    db.session.commit()

    response = jsonify({"message": "تم تسجيل الخروج بنجاح"})

    # ❌ مهم: لا تعتمد على unset_jwt_cookies وحده
    # ✅ حذف يدوي 100%
    response.set_cookie("access_token", "", max_age=0, expires=0, path="/", httponly=True, samesite="Lax", secure=False)
    response.set_cookie("refresh_token", "", max_age=0, expires=0, path="/auth/refresh", httponly=True, samesite="Lax", secure=False)
    response.set_cookie("csrf_access", "", max_age=0, expires=0, path="/", httponly=False, samesite="Lax", secure=False)
    response.set_cookie("csrf_refresh", "", max_age=0, expires=0, path="/auth/refresh", httponly=False, samesite="Lax", secure=False)

    return response, 200



# ✅ جلب المستخدم الحالي
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"message": "المستخدم غير موجود"}), 404
    return jsonify({"user": user.to_dict()})
