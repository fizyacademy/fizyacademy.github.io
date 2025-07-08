// Navbar.jsx

import { FiLogOut } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext"; // ✅
import { mainPath } from "../utils";

function Navbar() {
  const navigate = useNavigate();
  const { logout } = useAuth(); // ✅

  const handleLogout = () => {
    logout(); // حذف التوكن واليوزر من السياق
    navigate("/"); // الرجوع للرئيسية
  };

  return (
    <header className="fixed top-0 left-0 w-full h-[8vh] bg-white/70 dark:bg-gray-800 backdrop-blur z-50 shadow-md border-b border-gray-200 dark:border-gray-700 px-4 md:px-8 flex items-center justify-between text-gray-900 dark:text-white">
      <a href={mainPath} className="text-xl md:text-2xl font-bold text-violet-700 dark:text-violet-300">
        Fizyacademy<span className="text-xs text-amber-500">.com</span>
      </a>

      <div className="flex items-center gap-3 md:gap-4">
        <ThemeToggle />
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm md:text-base transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            تسجيل الخروج
            <FiLogOut />
          </div>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
