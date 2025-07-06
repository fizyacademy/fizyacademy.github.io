// utils.jsx
const mainPath = "http://localhost:5173/";
const API_BASE_URL = "http://localhost:5000";

const subscription = () => "Premium";
const averageMark = 95;

// 🧠 المتغيرات الداخلية
let username = "";
let arabic_name = "";
let role = "";
let stage = "student";
let userID = "";
let coupon = "";
let studentPhone = "";
let fatherPhone = "";
let userCode = "";
let points = 0;
let referredBy = "";

// ✅ تحديث المتغيرات بناء على بيانات السيرفر
const setUserData = (userData) => {
  if (!userData || typeof userData !== "object") return;

  username = userData.username || "";
  arabic_name = userData.arabic_name || "";
  role = userData.role || "guest";
  stage = userData.stage || "student";
  userID = userData.userID || "";
  coupon = userData.coupon_code || "";
  studentPhone = userData.student_phone || "";
  fatherPhone = userData.father_phone || "";
  userCode = userData.user_code || "";
  points = parseInt(userData.points || 0);
  referredBy = userData.referred_by || "";
};

// ✅ تحميل البيانات مرة واحدة عند بدء التشغيل
const initUserData = async () => {
  try {
    const data = await fetchWithAuth("/auth/me");
    console.log("🔍 fetched user data:", data);
    setUserData(data.user); // أو data حسب النتيجة
  } catch (err) {
    console.error("❌ Failed to fetch user data:", err.message);
  }
};


// ✅ تسجيل الدخول
const login = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
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

  username = arabic_name = role = stage = userID = coupon = studentPhone = fatherPhone = userCode = referredBy = "";
  points = 0;

  window.location.href = mainPath;
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

// ✅ دالة فحص المصادقة
const isAuthenticated = () => role && role !== "guest";

// ✅ دالة استخراج CSRF Token
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};

// ✅ fetch مخصص بالتوكن
const fetchWithAuth = async (url, options = {}) => {
  const method = (options.method || "GET").toUpperCase();
  const csrfToken = getCookie("csrf_access_token");

  const finalOptions = {
    ...options,
    credentials: "include",
    headers: {
      ...(method !== "GET" ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
      ...(method !== "GET" && csrfToken
        ? { "X-CSRF-TOKEN": csrfToken }
        : {}),
    },
  };

  const response = await fetch(`${API_BASE_URL}${url}`, finalOptions);
  const data = await response.json();

  if (!response.ok) throw new Error(data.message || "Request failed");

  return data;
};

// ✅ getters
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
  mainPath,
  subscription,
  averageMark,
  API_BASE_URL,
  fetchWithAuth,
  isAuthenticated,
  logout,
  register,
  login,
  initUserData,
  setUserData,
  // getters
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
