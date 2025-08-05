// utils.jsx

const API_BASE_URL = "http://localhost:5000";
const mainPath = "http://localhost:5173"; // المسار الرئيسي للموقع

// ✅ استخراج توكن CSRF من الكوكيز
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
};

// ✅ طلب مخصص للتوكن و CSRF
const fetchWithAuth = async (url, options = {}) => {
  const method = (options.method || "GET").toUpperCase();
  const csrfToken = getCookie("csrf_access");

  const finalOptions = {
    ...options,
    credentials: "include",
    headers: {
      ...(method !== "GET" ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
      ...(method !== "GET" && csrfToken ? { "X-CSRF-TOKEN": csrfToken } : {}),
    },
  };

  let response = await fetch(`${API_BASE_URL}${url}`, finalOptions);

  // لو التوكن منتهي وحصل 401، حاول تجديد التوكن
  if (response.status === 401) {
    try {
      const csrfRefresh = getCookie("csrf_refresh");
      const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRF-TOKEN": csrfRefresh,
        },
      });

      if (refreshRes.ok) {
        // نجح تجديد التوكن، عيد الطلب الأساسي
        const retryCsrfToken = getCookie("csrf_access");
        const retryOptions = {
          ...options,
          credentials: "include",
          headers: {
            ...(method !== "GET" ? { "Content-Type": "application/json" } : {}),
            ...(options.headers || {}),
            ...(method !== "GET" && retryCsrfToken
              ? { "X-CSRF-TOKEN": retryCsrfToken }
              : {}),
          },
        };
        response = await fetch(`${API_BASE_URL}${url}`, retryOptions);
      } else {
        throw new Error("انتهت الجلسة. الرجاء تسجيل الدخول مجددًا.");
      }
    } catch {
      throw new Error("انتهت الجلسة. الرجاء تسجيل الدخول مجددًا.");
    }
  }

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Request failed");

  return data;
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
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// ✅ تسجيل الخروج
const logout = async () => {
  try {
    const csrfToken = getCookie("csrf_access"); // ← دي مهمة

    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CSRF-TOKEN": csrfToken,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Logout failed");
    }
  } catch (err) {
    console.error("Logout error:", err.message);
  }
};


export {
  API_BASE_URL,
  mainPath,
  fetchWithAuth,
  login,
  logout,
};
