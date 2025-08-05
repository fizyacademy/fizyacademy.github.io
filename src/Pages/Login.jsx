// Login.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLock, FiEye, FiEyeOff, FiCheck } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../AuthContext";
import { showPromise } from "../components/Toast";

function Login() {
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await showPromise(login(username, password), {
        loading: "جارٍ تسجيل الدخول...",
        success: "تم تسجيل الدخول بنجاح",
        error: (err) => err.message || "فشل تسجيل الدخول",
      });
      navigate("/");
    } catch {
      // Error handling is done in showPromise
    }
  };

  const handleGoogleLogin = () => {
    const win = window.open("http://localhost:5000/auth/google-login", "_blank", "width=500,height=600");
    if (!win) {
      alert("يرجى السماح بالنوافذ المنبثقة (popups) لتسجيل الدخول بجوجل");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 to-white dark:from-gray-900 dark:to-gray-800 px-4 py-10 flex items-center justify-center text-gray-900 dark:text-white">
      <div className="bg-white/70 dark:bg-gray-900/80 backdrop-blur rounded-xl shadow-xl w-full max-w-md p-6 sm:p-8 space-y-6">
        <div className="flex justify-between items-center mb-2 sm:mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-violet-700 dark:text-violet-300">تسجيل الدخول باستخدام جوجل</h2>
          <ThemeToggle />
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="cursor-pointer w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md py-2 font-medium transition"
        >
          <FcGoogle className="text-xl" />
          الدخول باستخدام Google
        </button>

        <form onSubmit={handleLogin} className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-violet-700 dark:text-violet-300">أو تسجيل دخول</h2>
          <div>
            <label className="block mb-1 text-sm">اسم المستخدم أو الإيميل أو رقم الطالب</label>
            <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 rounded-md px-3 shadow-inner">
              <FiUser className="text-xl text-violet-600 dark:text-violet-400" />
              <input
                type="text"
                placeholder="اسم المستخدم أو الإيميل أو رقم الطالب"
                value={username}
                onChange={(e) => setUser(e.target.value)}
                required
                className="w-full bg-transparent py-3 text-gray-800 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm">كلمة المرور</label>
            <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 rounded-md px-3 shadow-inner">
              <FiLock className="text-xl text-violet-600 dark:text-violet-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPass(e.target.value)}
                required
                className="w-full bg-transparent py-3 text-gray-800 dark:text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-violet-600 dark:text-violet-400 cursor-pointer"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-md font-semibold transition cursor-pointer"
          >
            <FiCheck className="text-lg" />
            تسجيل الدخول
          </button>
        </form>

        <p className="text-center text-sm text-gray-700 dark:text-gray-300">
          لا تملك حساب؟{" "}
          <a href="/register" className="text-violet-600 hover:underline dark:text-violet-400">
            سجل الآن
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
