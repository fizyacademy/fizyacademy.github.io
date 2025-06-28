const mainPath = "http://localhost:5173/";

const subscription = () => {
    return "Premium";
};

const averageMark = 95;

const API_BASE_URL = "http://localhost:5000";

// استرداد القيم المخزنة من localStorage
let username = localStorage.getItem("username") || "";
let arabic_name = localStorage.getItem("arabic_name") || "";
let role = localStorage.getItem("role") || "";
let stage = localStorage.getItem("stage") || "student";
let userID = localStorage.getItem("userID") || "";
let coupon = localStorage.getItem("coupon") || "";
let studentPhone = localStorage.getItem("student_phone") || "";
let fatherPhone = localStorage.getItem("father_phone") || "";
let userCode = localStorage.getItem("user_code") || "";
let points = parseInt(localStorage.getItem("points")) || 0;
let referredBy = localStorage.getItem("referred_by") || "";

// ✅ setters منفصلة
const setUsername = (newUsername) => {
    localStorage.setItem("username", newUsername);
    username = newUsername;
};

const setRole = (newRole) => {
    localStorage.setItem("role", newRole);
    role = newRole;
};

const setStage = (newStage) => {
    localStorage.setItem("stage", newStage);
    stage = newStage;
};

const setUserID = (newUserID) => {
    localStorage.setItem("userID", newUserID);
    userID = newUserID;
};

const setStudentPhone = (newStudentPhone) => {
    localStorage.setItem("student_phone", newStudentPhone);
    studentPhone = newStudentPhone;
};

const setFatherPhone = (newFatherPhone) => {
    localStorage.setItem("father_phone", newFatherPhone);
    fatherPhone = newFatherPhone;
};

const setUserCode = (newCode) => {
    localStorage.setItem("user_code", newCode);
    userCode = newCode;
};

const setPoints = (newPoints) => {
    localStorage.setItem("points", newPoints.toString());
    points = parseInt(newPoints);
};

const setReferredBy = (code) => {
    localStorage.setItem("referred_by", code);
    referredBy = code;
};

// ✅ setUserData الشاملة
const setUserData = (userData) => {
    if (!userData || typeof userData !== "object") return;

    const {
        username = "",
        arabic_name = "",
        role = "guest",
        stage = "",
        userID = "",
        coupon_code = "",
        student_phone = "",
        father_phone = "",
        user_code = "",
        points = 0,
        referred_by = "",
    } = userData;

    localStorage.clear();

    localStorage.setItem("username", username);
    localStorage.setItem("arabic_name", arabic_name);
    localStorage.setItem("role", role);
    localStorage.setItem("stage", stage);
    localStorage.setItem("userID", userID);
    localStorage.setItem("coupon", coupon_code);
    localStorage.setItem("student_phone", student_phone);
    localStorage.setItem("father_phone", father_phone);
    localStorage.setItem("user_code", user_code);
    localStorage.setItem("points", points.toString());
    localStorage.setItem("referred_by", referred_by);

    // تحديث القيم في الذاكرة
    setUsername(username);
    setRole(role);
    setStage(stage);
    setUserID(userID);
    setStudentPhone(student_phone);
    setFatherPhone(father_phone);
    setUserCode(user_code);
    setPoints(points);
    setReferredBy(referred_by);

    window.dispatchEvent(new Event("storage"));
};

// ✅ التأكد من تسجيل الدخول
const isAuthenticated = () => {
    return !!localStorage.getItem("role");
};

// ✅ تسجيل الخروج
const logout = async () => {
    try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
        });
    } catch (err) {
        console.error("Logout error:", err.message);
    }

    // تنظيف localStorage
    localStorage.clear();
    role = username = stage = userID = coupon = studentPhone = fatherPhone = userCode = referredBy = "";
    points = 0;

    window.location.href = "/login";
};

// ✅ دالة التسجيل
const register = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Registration failed");

        return { success: true, message: data.message };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// ✅ دالة تسجيل الدخول
const login = async (username, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Login failed");

        setUserData(data.user);

        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

// ✅ دالة fetch مع التوكن والكوكي
const fetchWithAuth = async (url, options = {}) => {
    const finalOptions = {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    };

    const response = await fetch(`${API_BASE_URL}${url}`, finalOptions);
    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Request failed");

    return data;
};

// ✅ دوال get للبيانات
const getRole = () => role;
const getUserID = () => userID;
const getStage = () => stage;
const getCoupon = () => coupon;
const getUsername = () => username;
const getStudentPhone = () => studentPhone;
const getFatherPhone = () => fatherPhone;
const getArabicName = () => arabic_name;
const getUserCode = () => userCode;
const getPoints = () => points;
const getReferredBy = () => referredBy;

// ✅ تصدير شامل
export {
    role,
    username,
    arabic_name,
    stage,
    userID,
    coupon,
    studentPhone,
    fatherPhone,
    userCode,
    points,
    referredBy,
    setUserCode,
    setRole,
    mainPath,
    subscription,
    averageMark,
    API_BASE_URL,
    fetchWithAuth,
    isAuthenticated,
    logout,
    register,
    login,
    setUserData,
    setUsername,
    setStage,
    setUserID,
    setStudentPhone,
    setFatherPhone,
    setPoints,
    setReferredBy,
    getUsername,
    getArabicName,
    getRole,
    getStage,
    getUserID,
    getCoupon,
    getStudentPhone,
    getFatherPhone,
    getUserCode,
    getPoints,
    getReferredBy,
};
