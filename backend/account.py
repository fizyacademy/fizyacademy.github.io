# account.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash, generate_password_hash
from models import User
from db import db
import re

account_bp = Blueprint("account", __name__)

# ✅ تحقق أن الاسم يحتوي فقط على أحرف عربية وثلاث كلمات على الأقل
def is_valid_arabic_name(name):
    return re.fullmatch(r"^[\u0600-\u06FF]{2,}(?: [\u0600-\u06FF]{2,}){2,}$", name.strip()) is not None

# ✅ المراحل المسموح بها
VALID_STAGES = {
    "1st_sec", "2nd_sec", "3rd_sec"
}

@account_bp.route("/update", methods=["PUT"])
@jwt_required()
def update_profile():
    user = User.query.get(get_jwt_identity())
    data = request.get_json()
    role = user.role

    if "avatar" in data:
        if data["avatar"] not in {
            "boy_1", "boy_2", "boy_3", "boy_4", "boy_5",
            "girl_1", "girl_2", "girl_3", "girl_4", "girl_5"
        }:
            return jsonify({"message": "أفاتار غير صالح"}), 400
        user.avatar = data["avatar"]

    # ✅ تعديل الاسم العربي متاح للجميع
    if "arabic_name" in data:
        if not is_valid_arabic_name(data["arabic_name"]):
            return jsonify({"message": "الاسم يجب أن يكون عربيًا ثلاثيًا"}), 400
        user.arabic_name = data["arabic_name"].strip()

    # 👨‍🎓 الطالب فقط يقدر يغيّر الباقي
    if role == "student":
        # ✅ تحقق أن رقم الطالب لا يساوي رقم ولي الأمر
        if (
            "student_phone" in data
            and "father_phone" in data
            and data["student_phone"] == data["father_phone"]
        ):
            return jsonify({"message": "رقم الطالب لا يجب أن يطابق رقم ولي الأمر"}), 400

        if "email" in data and data["email"] != user.email:
            if User.query.filter_by(email=data["email"]).first():
                return jsonify({"message": "البريد الإلكتروني مستخدم بالفعل"}), 400
            user.email = data["email"]

        if "stage" in data:
            if data["stage"] not in VALID_STAGES:
                return jsonify({"message": "مرحلة غير صالحة"}), 400
            user.stage = data["stage"]

        if "father_phone" in data:
            user.father_phone = data["father_phone"]

        if "student_phone" in data and data["student_phone"] != user.student_phone:
            if User.query.filter_by(student_phone=data["student_phone"]).first():
                return jsonify({"message": "رقم الطالب مستخدم بالفعل"}), 400
            user.student_phone = data["student_phone"]

    # 👨‍🏫 admin/moderator لا يحق لهم تعديل الحقول الأخرى
    elif role in ["admin", "moderator"]:
        pass

    else:
        return jsonify({"message": "دور غير مصرح به"}), 403

    db.session.commit()
    return jsonify({"message": "تم تحديث البيانات بنجاح ✅", "user": user.to_dict()}), 200

@account_bp.route("/change-password", methods=["PUT"])
@jwt_required()
def change_password():
    data = request.get_json()

    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"message": "المستخدم غير موجود"}), 404

    current_password = data.get("current_password", "")
    new_password = data.get("new_password", "")
    confirm_password = data.get("confirm_password", "")

    if not check_password_hash(user.password, current_password):
        return jsonify({"message": "❌ كلمة المرور الحالية غير صحيحة"}), 400

    if len(new_password) < 6:
        return jsonify({"message": "❌ كلمة المرور الجديدة ضعيفة"}), 400

    if new_password != confirm_password:
        return jsonify({"message": "❌ كلمتا المرور غير متطابقتين"}), 400

    # تحديث كلمة المرور
    user.password = generate_password_hash(new_password)
    db.session.commit()

    return jsonify({"message": "✅ تم تغيير كلمة المرور بنجاح"}), 200
