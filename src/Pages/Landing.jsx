// Landing.jsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../AuthContext";

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ استخدم الكونتكست

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white transition-colors duration-300 flex items-center justify-center px-4">
      <div className="absolute top-4 left-4">
        <ThemeToggle />
      </div>
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          تعلم الفيزياء بطرق{" "}
          <span className="text-violet-600 dark:text-violet-400">حديثة وسهلة</span>
        </h1>

        <p className="text-lg md:text-xl mb-10 text-gray-700 dark:text-gray-300">
          احصل على أفضل الشروحات والتدريبات لمختلف المستويات الدراسية
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/register")}
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-6 rounded-lg text-lg transition cursor-pointer"
          >
            التسجيل الآن
          </button>
          <button
            onClick={() => navigate("/login")}
            className="border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 py-3 px-6 rounded-lg text-lg transition cursor-pointer"
          >
            تسجيل الدخول
          </button>
        </div>
      </div>
    </div>
  );
}
