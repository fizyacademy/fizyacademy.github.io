import PropTypes from "prop-types";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";
import QuizBtn from "../components/QuizBtn";
import { subscription, averageMark, getStage } from "../utils";
import AccountInfo from "../components/AccountInfo";
import MobileBottomNav from "../components/MobileBottomNav";

function Student() {
  const stage = getStage();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="w-full min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white">
      <Navbar />

      <div className="flex pt-[8vh]">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        <main
          className={`flex-1 transition-all duration-500 p-4 md:p-6 lg:p-8 space-y-6 pb-24 md:pb-6 ${
            isCollapsed ? "md:mr-[60px]" : "md:mr-[250px]"
          }`}
        >
          <WidgetCont>
            <Post title="الحساب (طالب)" className="col-span-2 row-span-2" container showToggle>
              <AccountInfo />
            </Post>
            <Post title="الصف الدراسي" body={stage} className="col-span-2 row-span-1" />
            <Post title="نوع الاشتراك" body={subscription()} className="col-span-1 row-span-1" showToggle />
            <Post
              title="التقييم الاجمالي"
              body={
                <span className="flex gap-3 items-center">
                  <div className="rounded-full w-4 h-4 bg-green-700"></div> {averageMark}
                </span>
              }
              className="col-span-1 row-span-1"
            />
          </WidgetCont>

          <WidgetCont>
            <Post title="الاختبارات" className="col-span-2 row-span-2" container showToggle>
              <QuizBtn quizName="test" />
              {/* ...باقي الأزرار */}
            </Post>
            <Post title="آخر اختبار" className="col-span-2 row-span-1" container>
              {/* جدول آخر اختبار */}
            </Post>
            <Post title="أعلى درجة" body="100%" className="col-span-1 row-span-1" />
            <Post title="أقل درجة" body="85%" className="col-span-1 row-span-1" />
          </WidgetCont>

          <WidgetCont>
            <Post title="الواجبات" className="col-span-2 row-span-2" container showToggle>
              <QuizBtn quizName="test" />
              {/* ...باقي الأزرار */}
            </Post>
            <Post title="الحالة" body="تم التسليم (5/6)" className="col-span-2 row-span-1" state />
            <Post title="واجب لم يتم تسليمه" className="col-span-2 row-span-1" container>
              <QuizBtn quizName="test" />
              {/* ...باقي الأزرار */}
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

export default Student;
