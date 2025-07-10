import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { fetchWithAuth, login as loginAPI, logout as logoutAPI } from "./utils";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const initUser = async () => {
    try {
      const res = await fetchWithAuth("/auth/me");
      setUser(res.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const result = await loginAPI(username, password);
    if (result.success) {
      await initUser(); // إعادة تحميل بيانات المستخدم بعد تسجيل الدخول
    }
    return result;
  };

  const logout = async () => {
    await logoutAPI();

    // حذف الكوكيز يدويًا (نفس المسارات)
    document.cookie = "access_token=; Max-Age=0; path=/";
    document.cookie = "refresh_token=; Max-Age=0; path=/";
    document.cookie = "csrf_access=; Max-Age=0; path=/";
    document.cookie = "csrf_refresh=; Max-Age=0; path=/";

    setUser(null);
  };

  useEffect(() => {
    initUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
