# models.py

from datetime import datetime
from db import db
import uuid
from slugify import slugify

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
    coupon_code = db.Column(db.String(20), unique=True)  # ✅ فريد
    referred_by = db.Column(db.String(20))  # ✅ يشير إلى الكوبون المستخدم
    points = db.Column(db.Integer, default=0)  # ✅ نقاط المستخدم
    user_code = db.Column(db.String(10), unique=True)  # ✅ للبحث من الدعم
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_approved = db.Column(db.Boolean, default=False)
    gender = db.Column(db.String(10))  # "male" أو "female"
    avatar = db.Column(db.String(50))  # مثل: "boy_1", "girl_2"


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

class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    video_code = db.Column(db.String(20), unique=True, nullable=False)  # مثل #123456789012345
    title = db.Column(db.String(200), nullable=False)
    stage = db.Column(db.String(20), nullable=False)
    term = db.Column(db.String(10), nullable=False)  # '1st' أو '2nd'
    lecture_name = db.Column(db.String(100), nullable=False)
    section_name = db.Column(db.String(100), nullable=True)
    order_in_section = db.Column(db.Integer)
    video_path = db.Column(db.String(300), nullable=False)  # مسار الفيديو في الاستضافة
    slug = db.Column(db.String(200), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "video_code": self.video_code,
            "slug": self.slug,
            "title": self.title,
            "stage": self.stage,
            "term": self.term,
            "lecture_name": self.lecture_name,
            "section_name": self.section_name,
            "order_in_section": self.order_in_section,
            "video_path": self.video_path
        }