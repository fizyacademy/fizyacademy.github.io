// Admin.jsx

import { useState } from "react";
import PropTypes from "prop-types";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";
import AccountInfo from "../components/AccountInfo";
import AdminApproval from "../components/AdminApproval";
import MobileBottomNav from "../components/MobileBottomNav";
import { useAuth } from "../AuthContext"; // ✅ استدعاء الكونتكست

function Admin() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth(); // ✅ استخدام بيانات المستخدم

  return (
    <div className="w-full min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white">
      <Navbar />
      <div className="flex pt-[8vh]">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        <main className={`flex-1 transition-all duration-500 p-4 md:p-6 lg:p-8 space-y-6 pb-24 md:pb-6 ${isCollapsed ? "md:mr-[60px]" : "md:mr-[250px]"}`}>
          <WidgetCont>
            <Post title="الحساب (مسؤول)" className="col-span-4 row-span-2" container showToggle>
              <AccountInfo />
            </Post>
          </WidgetCont>

          {user?.username === "admin" && (
            <WidgetCont>
              <Post title="المسؤولين" className="col-span-2 row-span-2" container showToggle>
                <SimpleTable headers={["الاسم", "الحالة"]} rows={[["مسؤول 1", "نشط"], ["مسؤول 2", "غير نشط"]]} />
              </Post>
              <Post title="طلبات المسؤولين" className="col-span-2 row-span-2" container>
                <SimpleTable headers={["اسم المسؤول", "عنوان الطلب", ""]} rows={[["مسؤول 1", "إجازة", "الطلب"], ["مسؤول 2", "استقالة", "الطلب"]]} linkColumn={2} />
              </Post>
            </WidgetCont>
          )}

          <WidgetCont>
            <Post title="المشرفين" className="col-span-2 row-span-2" container showToggle>
              <SimpleTable headers={["الاسم", "الحالة"]} rows={[["مشرف 1", "نشط"], ["مشرف 2", "غير نشط"]]} />
            </Post>
            <Post title="طلبات المشرفين" className="col-span-2 row-span-2" container>
              <SimpleTable headers={["اسم المشرف", "عنوان الطلب", ""]} rows={[["مشرف 1", "إجازة", "الطلب"], ["مشرف 2", "استقالة", "الطلب"]]} linkColumn={2} />
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
              <SimpleTable headers={["الاسم", "الصف"]} rows={[["طالب 1", "الثالث الثانوي"], ["طالب 2", "الثاني الثانوي"]]} />
            </Post>
            <Post title="الطلاب المتفوقين" className="col-span-2 row-span-2" container>
              <SimpleTable headers={["اسم الطالب", "التقييم الإجمالي", ""]} rows={[["طالب 1", "100%", "محادثة"]]} linkColumn={2} />
            </Post>
          </WidgetCont>

          <WidgetCont>
            <Post title="الطلاب المتوسطين" className="col-span-2 row-span-2" container>
              <SimpleTable headers={["اسم الطالب", "التقييم الإجمالي", ""]} rows={[["طالب 3", "60%", "محادثة"]]} linkColumn={2} />
            </Post>
            <Post title="الطلاب الضعاف" className="col-span-2 row-span-2" container>
              <SimpleTable headers={["اسم الطالب", "التقييم الإجمالي", ""]} rows={[["طالب 4", "40%", "محادثة"]]} linkColumn={2} />
            </Post>
          </WidgetCont>

          <WidgetCont>
            <Post title="الاختبارات" className="col-span-2 row-span-2" container showToggle>
              <SimpleTable headers={["العنوان", "الصف", ""]} rows={[["الاختبار الأول", "الثالث الثانوي", "الإجراءات"]]} linkColumn={2} />
            </Post>
            <Post title="الواجبات" className="col-span-2 row-span-2" container showToggle>
              <SimpleTable headers={["العنوان", "الصف", ""]} rows={[["الواجب الأول", "الثالث الثانوي", "الإجراءات"]]} linkColumn={2} />
            </Post>
          </WidgetCont>

          {user?.username === "admin" && (
            <div>
              <AdminApproval />
            </div>
          )}
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

WidgetCont.propTypes = { children: PropTypes.node };

function SimpleTable({ headers, rows, linkColumn }) {
  return (
    <table className="w-full text-center text-sm border-separate border-spacing-y-1">
      <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white">
        <tr>{headers.map((h, i) => <th key={i} className="py-2 px-3">{h}</th>)}</tr>
      </thead>
      <tbody className="text-gray-700 dark:text-gray-100">
        {rows.map((row, i) => (
          <tr key={i} className="bg-white dark:bg-gray-800 rounded-xl">
            {row.map((cell, j) => (
              <td key={j} className="py-2 px-3">
                {linkColumn === j ? <a className="text-violet-400 hover:text-violet-600 font-bold">{cell}</a> : cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

SimpleTable.propTypes = {
  headers: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  linkColumn: PropTypes.number,
};

export default Admin;
