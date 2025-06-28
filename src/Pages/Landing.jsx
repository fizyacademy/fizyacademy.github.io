import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated} from "../utils";

export default function Landing() {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();

  // If already logged in, redirect to the respective dashboard
  useEffect(() => {
    if (loggedIn) {
      navigate("/", { replace: true });
      // window.location.href = mainPath;
    }
  }, [loggedIn, navigate]);

  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center h-screen bg-cover bg-center">
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">تعلم الفيزياء بطرق حديثة وسهلة</h1>
          <p className="text-lg md:text-xl mb-6">احصل على أفضل الشروحات والتدريبات لمختلف المستويات الدراسية</p>

          {/* Auth Buttons */}
            <div className="flex gap-4">
              <button 
                onClick={() => navigate("/register")} 
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-lg"
              >
                التسجيل الآن
              </button>
              <button 
                onClick={() => navigate("/login")} 
                className="border-2 border-white hover:bg-white hover:text-gray-900 py-3 px-6 rounded-lg text-lg"
              >
                تسجيل الدخول
              </button>
            </div>

        </div>
      </section>
    </div>
  );
}
