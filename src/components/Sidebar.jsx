// Sidebar.jsx

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import SidebarToggle from "./SidebarToggle";
import AccountInfo from "./AccountInfo";
import SideBtn from "./SideBtn";
import { Link, useNavigate } from "react-router-dom";
import { FiSettings, FiLogOut } from "react-icons/fi";
import MobileBottomNav from "./MobileBottomNav";
import { navLinks } from "../constants/navLinks";
import { useAuth } from "../AuthContext";
import { showSuccess } from "./Toast";

function Sidebar({ isCollapsed, setIsCollapsed }) {
  const [showSidebar, setShowSidebar] = useState(true);
  const [extraLinks, setExtraLinks] = useState([]);
  const [showText, setShowText] = useState(!isCollapsed);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // تحديد الروابط حسب الدور
  useEffect(() => {
    const role = user?.role || "guest";
    setExtraLinks(navLinks[role] || []);
  }, [user]);

  // مراقبة حجم الشاشة
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // تأخير ظهور النص بعد التوسيع
  useEffect(() => {
    if (!isCollapsed) {
      const timeout = setTimeout(() => setShowText(true), 300); // نفس مدة الترانزيشن
      return () => clearTimeout(timeout);
    } else {
      setShowText(false);
    }
  }, [isCollapsed]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setTimeout(() => {
      showSuccess("تم تسجيل الخروج")
    }, 1000);
  };

  if (!showSidebar) return <MobileBottomNav />;

  return (
    <div
      className={`fixed top-[8vh] h-[92vh] z-50 transition-all duration-500 ease-in-out ${
        isCollapsed ? "w-[60px]" : "w-[250px]"
      } bg-white/70 dark:bg-gray-800 backdrop-blur border-e border-gray-300 dark:border-gray-700 flex flex-col shadow-xl`}
    >
      <SidebarToggle isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4">
        <Link
          to="/account"
          className="w-full block hover:bg-violet-50 dark:hover:bg-gray-800 rounded-xl mx-2 mb-4"
        >
          <AccountInfo isCollapsed={isCollapsed} role={user?.role} />
        </Link>

        <div className="flex flex-col-reverse gap-1 px-2">
          {extraLinks.map(({ icon, text, link }, idx) => (
            <SideBtn
              key={idx}
              icon={icon}
              text={text}
              link={link}
              isCollapsed={isCollapsed}
            />
          ))}

          <SideBtn icon="home" text="الرئيسية" link="/" isCollapsed={isCollapsed} />
        </div>
      </div>

      <div className="mt-auto p-2 flex flex-col gap-2">
        <Link
          to="settings"
          className={`flex items-center justify-center gap-2 bg-violet-800/80 dark:bg-violet-800 backdrop-blur rounded-lg py-2 text-lg text-white hover:bg-violet-700 dark:hover:bg-violet-900 transition ${
            isCollapsed ? "px-3" : "pl-3"
          }`}
        >
          {!isCollapsed ? (
            <div className="flex flex-0 h-full border-l-2 border-amber-50 px-3 text-center items-center right-0">
              <FiSettings />
            </div>
          ) : (
            <FiSettings />
          )}
          {showText && <span className="flex-1 text-center">الإعدادات</span>}
        </Link>

        <button
          onClick={handleLogout}
          className={`flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 text-lg transition cursor-pointer ${
            isCollapsed ? "px-3" : "pl-3"
          }`}
        >
          {!isCollapsed ? (
            <div className="flex flex-0 h-full border-l-2 border-amber-50 px-3 text-center items-center right-0">
              <FiLogOut />
            </div>
          ) : (
            <FiLogOut />
          )}
          {showText && <span className="flex-1 text-center">تسجيل الخروج</span>}
        </button>
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  setIsCollapsed: PropTypes.func.isRequired,
};

export default Sidebar;
