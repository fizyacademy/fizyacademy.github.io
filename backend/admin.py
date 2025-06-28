from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User
from db import db

admin_bp = Blueprint("admin", __name__)

def is_super_admin(user):
    return user and user.role == "admin" and user.is_approved

@admin_bp.route("/pending", methods=["GET"])
@jwt_required()
def get_pending_users():
    current_user = User.query.get(get_jwt_identity())
    if not is_super_admin(current_user):
        return jsonify({"message": "غير مصرح"}), 403

    pending = User.query.filter(User.role.in_(["admin", "moderator"]), User.is_approved == False).all()
    return jsonify({"users": [user.to_dict() for user in pending]})


@admin_bp.route("/approve/<user_id>", methods=["POST"])
@jwt_required()
def approve_user(user_id):
    current_user = User.query.get(get_jwt_identity())
    if not is_super_admin(current_user):
        return jsonify({"message": "غير مصرح"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "المستخدم غير موجود"}), 404

    user.is_approved = True
    db.session.commit()
    return jsonify({"message": "تمت الموافقة بنجاح"})


@admin_bp.route("/reject/<user_id>", methods=["POST"])
@jwt_required()
def reject_user(user_id):
    current_user = User.query.get(get_jwt_identity())
    if not is_super_admin(current_user):
        return jsonify({"message": "غير مصرح"}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "المستخدم غير موجود"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "تم الرفض وحذف الحساب"})
