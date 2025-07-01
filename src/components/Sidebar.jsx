import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { mainPath, role, logout } from '../utils';
import SidebarToggle from './SidebarToggle';
import AccountInfo from './AccountInfo';
import SideBtn from './SideBtn';
import { Link } from "react-router-dom";
import { FiSettings, FiLogOut } from "react-icons/fi";
import MobileBottomNav from './MobileBottomNav';

function Sidebar({ isCollapsed, setIsCollapsed }) {
  const [showSidebar, setShowSidebar] = useState(true);

  // ✅ راقب حجم الشاشة وغيّر العرض حسب المساحة المتوفرة
  useEffect(() => {
    const handleResize = () => {
      // لو العرض أقل من 768 بيكسل اخفي السايدبار
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };

    handleResize(); // نفذها مرة مبدئياً
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = mainPath;
  };

  // ✅ لو السايدبار مش ظاهر، رجّع الـ Mobile Nav
  if (!showSidebar) return <MobileBottomNav />;

  return (
    <div
      className={`
        fixed top-[8vh] h-[92vh] z-50 transition-all duration-500 ease-in-out
        ${isCollapsed ? "w-[60px]" : "w-[250px]"}
        bg-white/70 dark:bg-gray-800 backdrop-blur border-e border-gray-300 dark:border-gray-700
        flex flex-col shadow-xl
      `}
    >
      {/* Toggle */}
      <SidebarToggle isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4">
        <Link to="/account" className="w-full block hover:bg-violet-50 dark:hover:bg-gray-800 rounded-xl mx-2 mb-4">
          <AccountInfo role={role} isCollapsed={isCollapsed} />
        </Link>

        <div className="flex flex-col gap-1 px-2">
          <SideBtn icon="home" text="الرئيسية" link="/" isCollapsed={isCollapsed} />

          {role === 'admin' && (
            <>
              <SideBtn icon="manage_accounts" text="إدارة المسؤولين" link="/admins" isCollapsed={isCollapsed} />
              <SideBtn icon="manage_accounts" text="إدارة المشرفين" link="/moderators" isCollapsed={isCollapsed} />
              <SideBtn icon="group" text="قائمة الطلاب" link="/students" isCollapsed={isCollapsed} />
              <SideBtn icon="quiz" text="الاختبارات" link="/admin/quizes" isCollapsed={isCollapsed} />
              <SideBtn icon="assignment" text="الواجبات" link="/admin/homeworks" isCollapsed={isCollapsed} />
              <SideBtn icon="video_library" text="المحاضرات" link="/video/upload" isCollapsed={isCollapsed} />
            </>
          )}

          {role === 'moderator' && (
            <>
              <SideBtn icon="group" text="الطلاب" link="/students" isCollapsed={isCollapsed} />
              <SideBtn icon="quiz" text="الاختبارات" link="/admin/quizes" isCollapsed={isCollapsed} />
              <SideBtn icon="assignment" text="الواجبات" link="/admin/homeworks" isCollapsed={isCollapsed} />
              <SideBtn icon="video_library" text="المحاضرات" link="/admin/sessions" isCollapsed={isCollapsed} />
            </>
          )}

          {role === 'student' && (
            <>
              <SideBtn icon="quiz" text="الاختبارات" link="/exams" isCollapsed={isCollapsed} />
              <SideBtn icon="assignment" text="الواجبات الدراسية" link="/homeworks" isCollapsed={isCollapsed} />
              <SideBtn icon="task" text="النتائج والتقييمات" link="/results" isCollapsed={isCollapsed} />
              <SideBtn icon="payments" text="إدارة الاشتراكات" link="/subscriptions" isCollapsed={isCollapsed} />
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto p-2 flex flex-col gap-2">
        <Link
          to={mainPath + 'settings'}
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
