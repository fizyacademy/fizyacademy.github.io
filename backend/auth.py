# auth.py

from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    unset_jwt_cookies,
)
from models import User
from db import db
import random

auth_bp = Blueprint("auth", __name__)

# ✅ توليد كوبون فريد: أول 5 حروف من username + 4 أرقام
def generate_coupon_code(username):
    base = username[:5].lower()
    while True:
        suffix = str(random.randint(1000, 9999))
        coupon = base + suffix
        if not User.query.filter_by(coupon_code=coupon).first():
            return coupon

# ✅ توليد كود مستخدم فريد للبحث (8 أرقام مع #)
def generate_unique_user_code():
    while True:
        code = "#" + str(random.randint(10000000, 99999999))
        if not User.query.filter_by(user_code=code).first():
            return code

# ✅ تسجيل مستخدم جديد
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    # التحقق من التكرار
    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"message": "اسم المستخدم موجود بالفعل"}), 400

    if data.get("email") and User.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "البريد الإلكتروني مستخدم بالفعل"}), 400

    if data.get("student_phone") and User.query.filter_by(student_phone=data["student_phone"]).first():
        return jsonify({"message": "رقم الطالب مستخدم بالفعل"}), 400

    # تحقق من الطول الأدنى لكلمة المرور
    if len(data["password"]) < 6:
        return jsonify({"message": "كلمة المرور يجب أن تكون على الأقل 6 أحرف"}), 400
    

    # التشفير وتوليد الأكواد
    hashed_password = generate_password_hash(data["password"])
    coupon = generate_coupon_code(data["username"])
    user_code = generate_unique_user_code()
    referred_by = data.get("referred_by")

    gender = data.get("gender")
    default_avatar = "boy_1" if gender == "male" else "girl_1"

    # إنشاء المستخدم
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
        gender=data.get(gender, 'male'),
        avatar=default_avatar,
        is_approved=True if data.get("role", "student") == "student" or data["username"] == "admin" else False
    )

    db.session.add(new_user)

    # ✅ تحديث نقاط المحيل إن وجد
    if referred_by:
        referrer = User.query.filter_by(coupon_code=referred_by).first()
        if referrer:
            referrer.points += 1

    db.session.commit()

    return jsonify({"message": "تم التسجيل بنجاح"}), 201

# ✅ تسجيل الدخول
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data["username"]).first()

    if not user or not check_password_hash(user.password, data["password"]):
        return jsonify({"message": "بيانات الدخول غير صحيحة"}), 401

    if not user.is_approved:
        return jsonify({"message": "لم يتم الموافقة على الحساب بعد"}), 403

    access_token = create_access_token(identity=user.id)
    response = jsonify({
        "message": "تم تسجيل الدخول بنجاح",
        "user": user.to_dict()
    })
    set_access_cookies(response, access_token)
    return response, 200

# ✅ جلب المستخدم الحالي
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"message": "المستخدم غير موجود"}), 404
    return jsonify({"user": user.to_dict()})

# ✅ تسجيل الخروج
@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    response = jsonify({"message": "تم تسجيل الخروج بنجاح"})
    unset_jwt_cookies(response)
    return response, 200
