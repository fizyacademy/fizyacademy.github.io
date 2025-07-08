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
import { useAuth } from "../AuthContext"; // ✅

function Sidebar({ isCollapsed, setIsCollapsed }) {
  const [showSidebar, setShowSidebar] = useState(true);
  const [extraLinks, setExtraLinks] = useState([]);

  const navigate = useNavigate();
  const { user, logout } = useAuth(); // ✅

  // ✅ تحديد الروابط حسب الدور
  useEffect(() => {
    const role = user?.role || "guest";
    setExtraLinks(navLinks[role] || []);
  }, [user]);

  // ✅ مراقبة حجم الشاشة
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

  const handleLogout = () => {
    logout();
    navigate("/")
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
          to={"settings"}
          className="flex items-center justify-center gap-2 bg-violet-800/80 dark:bg-violet-800 backdrop-blur rounded-lg px-3 py-2 text-lg text-white hover:bg-violet-700 dark:hover:bg-violet-900 transition"
        >
          <FiSettings />
          {!isCollapsed && <span>الإعدادات</span>}
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-lg px-3 py-2 text-lg transition cursor-pointer"
        >
          <FiLogOut />
          {!isCollapsed && <span>تسجيل الخروج</span>}
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
