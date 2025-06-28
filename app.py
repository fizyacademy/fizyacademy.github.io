from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_wtf.csrf import CSRFProtect
import os
from dotenv import load_dotenv
import db
from auth import auth
from admin import admin

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure CORS properly
CORS(
    app,
    supports_credentials=True,
    resources={r"/*": {"origins": "http://localhost:5173"}},  # السماح للواجهة الأمامية فقط
)

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "fallback_secret_key")
# CSRF Protection
csrf = CSRFProtect(app)

# JWT Configuration
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "fallback_secret")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 86400  # 24 Hours
app.config["SESSION_COOKIE_SECURE"] = False  # يجب أن يكون True على بيئة الإنتاج مع HTTPS
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "None"  # دعم الكوكيز عبر النطاقات

jwt = JWTManager(app)

# Initialize Database
db.initialize_db()

# Register Blueprints
app.register_blueprint(auth, url_prefix="/auth")
app.register_blueprint(admin, url_prefix="/admin")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)


auth.py:
from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended import create_access_token, set_access_cookies, jwt_required, get_jwt_identity
from models import add_user, verify_password, get_user_by_username
import datetime

auth = Blueprint("auth", __name__)

@auth.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        username = data.get("username")
        arabic_name = data.get("arabic_name")
        email = data.get("email")
        student_phone = data.get("student_phone")
        father_phone = data.get("father_phone")
        password = data.get("password")
        stage = data.get("stage")

        if not all([username, arabic_name, email, student_phone, father_phone, password, stage]):
            return jsonify({"message": "All fields are required"}), 400

        error = add_user(username, arabic_name, email, student_phone, father_phone, password, stage)

        if error:
            return jsonify({"message": error}), 400

        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        return jsonify({"message": str(e)}), 500

@auth.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"message": "Username and password are required"}), 400

        user = get_user_by_username(username)

        if not user or not verify_password(user, password):
            return jsonify({"message": "Invalid username or password"}), 401

        # Include all user data inside the token
        user_data = {
            "userID": user[0],
            "username": user[1],
            "arabic_name": user[2],
            "email": user[3],
            "role": user[6],
            "stage": user[7],
            "ID": user[8],
            "coupon_code": user[10],
            "student_phone": user[4],
            "father_phone": user[5],
        }

        access_token = create_access_token(identity=user_data, expires_delta=datetime.timedelta(days=1))

        response = make_response(jsonify({"message": "Login successful"}))
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"

        set_access_cookies(response, access_token, max_age=86400, samesite="None", secure=False)
        return response, 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500
    
@auth.route("/check", methods=["GET"])
@jwt_required()
def check_auth():
    current_user = get_jwt_identity()
    return jsonify({"user": current_user, "authenticated": True}), 200


db.py:
from models import create_tables

def initialize_db():
    create_tables()

if __name__ == "__main__":
    initialize_db()


models.py:
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import uuid

DB_NAME = "database.db"

def connect_db():
    return sqlite3.connect(DB_NAME)

def create_tables():
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        userID TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        arabic_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        student_phone TEXT NOT NULL,
        father_phone TEXT NOT NULL,
        role TEXT DEFAULT 'student',
        stage TEXT NOT NULL,
        ID TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        coupon_code TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        stage TEXT NOT NULL,
        term TEXT NOT NULL,
        name TEXT NOT NULL,
        ordering INTEGER NOT NULL
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS resources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        thumbnail TEXT NOT NULL,
        stage TEXT NOT NULL,
        term TEXT NOT NULL,
        session_name TEXT NOT NULL,
        ordering INTEGER NOT NULL,
        type TEXT NOT NULL
    )
    """)

    conn.commit()
    conn.close()

    # تأكد من أن المدير الافتراضي موجود
    create_default_admin()

def create_default_admin():
    """ إضافة مدير افتراضي عند إنشاء قاعدة البيانات لأول مرة """
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE username = 'admin'")
    admin = cursor.fetchone()

    if not admin:
        user_id = str(uuid.uuid4())
        hashed_password = generate_password_hash("admin")  # كلمة المرور الافتراضية هي "admin"

        cursor.execute("""
        INSERT INTO users (userID, username, arabic_name, email, student_phone, father_phone, role, stage, ID, password)
        VALUES (?, 'admin', 'مدير النظام', 'admin@fizyacademy.com', '0000000000', '0000000000', 'admin', 'N/A', ?, ?)
        """, (user_id, str(uuid.uuid4()), hashed_password))

        conn.commit()

    conn.close()

def add_user(username, arabic_name, email, student_phone, father_phone, password, stage):
    try:
        conn = connect_db()
        cursor = conn.cursor()

        user_id = str(uuid.uuid4())  # Generate a unique UUID for each user
        hashed_password = generate_password_hash(password)

        cursor.execute("""
        INSERT INTO users (userID, username, arabic_name, email, student_phone, father_phone, stage, ID, password)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (user_id, username, arabic_name, email, student_phone, father_phone, stage, str(uuid.uuid4()), hashed_password))

        conn.commit()
        conn.close()
        return None  # No error

    except sqlite3.IntegrityError:
        return "Username or email already exists."

    except Exception as e:
        return str(e)

def get_user_by_username(username):
    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()

    conn.close()
    return user

def verify_password(user, password):
    return check_password_hash(user[9], password)  # User password is at index 9