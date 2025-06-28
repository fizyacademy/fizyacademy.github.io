import PropTypes from 'prop-types';
import { mainPath, role, logout } from '../utils';
import SidebarToggle from './SidebarToggle';
import AccountInfo from './AccountInfo';
import SideBtn from './SideBtn';
import { Link } from "react-router-dom";


function Sidebar({isCollapsed, setIsCollapsed}) { 

    const handleLogout = () => {
        logout();
        window.location.href = mainPath;
    };

    return (
        <div 
            className={`fixed top-[8vh] h-[92vh] bg-gray-900 text-white flex flex-col shadow-2xl 
            transition-all duration-500 ease-in-out z-50 border-r border-gray-700 
            ${isCollapsed ? "w-[5vw]" : "w-[20vw]"}`}
        >
            {/* Sidebar Toggle */}
            <SidebarToggle isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            <div className="flex-1 overflow-y-auto">
                {/* Profile Section (Left-aligned) */}
                <div className="w-full flex">
                    <Link to='/account' className="hover:bg-gray-800 w-full flex justify-start p-2 transition-all">
                        <AccountInfo role={role} isCollapsed={isCollapsed} />
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col flex-grow">
                    <SideBtn icon="apps" text="الرئيسية" link="" isCollapsed={isCollapsed} />

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

            {/* Settings and Logout */}
            <div className="mt-auto flex flex-col items-center pb-4 gap-2">
                <a 
                    className={`bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg w-[90%] flex items-center justify-center transition-all`}
                    href={mainPath + 'settings'}
                >
                    <span className="material-symbols-outlined">settings</span>
                    {!isCollapsed && <span className="ml-2">الإعدادات</span>}
                </a>
                <a 
                    onClick={handleLogout} 
                    className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg w-[90%] flex items-center justify-center transition-all cursor-pointer"
                >
                    <span className="material-symbols-outlined">logout</span>
                    {!isCollapsed && <span className="ml-2">تسجيل الخروج</span>}
                </a>
            </div>
        </div>
    );
}

Sidebar.propTypes = {
    isCollapsed: PropTypes.bool.isRequired,
    setIsCollapsed: PropTypes.func.isRequired,
};

SidebarToggle.propTypes = {
    isCollapsed: PropTypes.bool.isRequired,
    setIsCollapsed: PropTypes.func.isRequired,
};

export default Sidebar;
