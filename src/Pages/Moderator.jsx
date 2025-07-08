import { useState } from "react";
import PropTypes from "prop-types";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";
import AccountInfo from "../components/AccountInfo";
import MobileBottomNav from "../components/MobileBottomNav";
import { useAuth } from "../AuthContext"; // ✅ استخدام AuthContext

function Moderator() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth(); // ✅ بيانات المستخدم

  return (
    <div className="w-full min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white">
      <Navbar />
      <div className="flex pt-[8vh]">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <main className={`flex-1 transition-all duration-500 p-4 md:p-6 lg:p-8 space-y-6 pb-24 md:pb-6 ${isCollapsed ? "md:mr-[60px]" : "md:mr-[250px]"}`}>
          <WidgetCont>
            <Post title="الحساب (مشرف)" className="col-span-4 row-span-2" container showToggle>
              <AccountInfo userData={user} />
            </Post>
          </WidgetCont>

          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-3">
            <select className="w-full bg-transparent border-none outline-none text-gray-900 dark:text-white cursor-pointer">
              <option className="bg-white dark:bg-gray-800">الكل</option>
              <option className="bg-white dark:bg-gray-800">الصف الأول الثانوي</option>
              <option className="bg-white dark:bg-gray-800">الصف الثاني الثانوي</option>
              <option className="bg-white dark:bg-gray-800">الصف الثالث الثانوي</option>
            </select>
          </div>

          <WidgetCont>
            <Post title="الطلاب" className="col-span-2 row-span-2" container showToggle>
              {/* جدول الطلاب */}
            </Post>
            <Post title="الطلاب المتفوقين" className="col-span-2 row-span-2" container>
              {/* جدول المتفوقين */}
            </Post>
          </WidgetCont>

          <WidgetCont>
            <Post title="الطلاب المتوسطين" className="col-span-2 row-span-2" container>
              {/* جدول المتوسطين */}
            </Post>
            <Post title="الطلاب الضعاف" className="col-span-2 row-span-2" container>
              {/* جدول الضعاف */}
            </Post>
          </WidgetCont>

          <WidgetCont>
            <Post title="الاختبارات" className="col-span-2 row-span-2" container showToggle>
              {/* جدول الاختبارات */}
            </Post>
            <Post title="الواجبات" className="col-span-2 row-span-2" container showToggle>
              {/* جدول الواجبات */}
            </Post>
          </WidgetCont>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}

function WidgetCont({ children }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {children}
    </div>
  );
}

WidgetCont.propTypes = {
  children: PropTypes.node,
};

export default Moderator;
