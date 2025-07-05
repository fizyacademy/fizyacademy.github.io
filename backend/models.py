# models.py

from datetime import datetime
from db import db
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class User(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    username = db.Column(db.String(50), unique=True, nullable=False)
    arabic_name = db.Column(db.String(100))
    email = db.Column(db.String(120), unique=True)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="student")
    stage = db.Column(db.String(20))
    student_phone = db.Column(db.String(20), unique=True)
    father_phone = db.Column(db.String(20))
    coupon_code = db.Column(db.String(20), unique=True)
    referred_by = db.Column(db.String(20))
    points = db.Column(db.Integer, default=0)
    user_code = db.Column(db.String(10), unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_approved = db.Column(db.Boolean, default=False)
    gender = db.Column(db.String(10))
    avatar = db.Column(db.String(50))

    def to_dict(self):
        return {
            "userID": self.id,
            "username": self.username,
            "arabic_name": self.arabic_name,
            "email": self.email,
            "role": self.role,
            "stage": self.stage,
            "student_phone": self.student_phone,
            "father_phone": self.father_phone,
            "coupon_code": self.coupon_code,
            "referred_by": self.referred_by,
            "points": self.points,
            "user_code": self.user_code,
            "is_approved": self.is_approved,
            "gender": self.gender,
            "avatar": self.avatar,
            "created_at": self.created_at.isoformat()
        }

# ✅ جدول لتخزين التوكنات الملغاة (revoked)
class TokenBlocklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
