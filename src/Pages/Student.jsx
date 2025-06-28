import PropTypes from "prop-types";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";
import QuizBtn from "../components/QuizBtn";
import { subscription, averageMark, getStage } from "../utils";
import AccountInfo from "../components/AccountInfo";


function Student() {
    const stage = getStage();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
    <div className={"App w-full h-[100vh] bg-gray-200 overflow-y-auto overflow-x-hidden relative"}>
        <Navbar />
        <div className="flex flex-col sm:flex-row justify-between gap-7 m-0">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}/>
        <div className={`flex flex-col gap-7 left-0 top-[8vh] absolute p-7 ${isCollapsed ? "w-[95vw]" : "w-[80vw]"}`}>
            <WidgetCont>
            <Post
                title={"الحساب (طالب)"}
                body=""
                className={"col-span-2 row-span-2"}
                container={true}
                showToggle={true}
            >
                <AccountInfo/>
            </Post>
            <Post
                title="الصف الدراسي"
                body={stage}
                className={"col-span-2 row-span-1"}
            />
            <Post
                title="نوع الاشتراك"
                body={subscription()}
                className={"col-span-1 row-span-1"}
                showToggle={true}
            />
            <Post
                title="التقييم الاجمالي"
                body={
                    <span className=" flex gap-3 items-center">
                        <div className="rounded-full w-4 h-4 bg-green-700"></div> {averageMark}
                    </span>
                }
                className={"col-span-1 row-span-1"}
            />
            </WidgetCont>
            <WidgetCont>
            <Post
                title="الإختبارات"
                body=""
                className={"col-span-2 row-span-2"}
                showToggle={true}
                container={true}
            >
                <QuizBtn quizName="test" />
                <QuizBtn quizName="test" />
                <QuizBtn quizName="test" />
                <QuizBtn quizName="test" />
                <QuizBtn quizName="test" />
                <QuizBtn quizName="test" />
                <QuizBtn quizName="test" />
            </Post>
            <Post
                title="آخر اختبار"
                body=""
                className={"col-span-2 row-span-1"}
                container={true}
            >
                <table className="text-center">
                    <thead className="bg-gray-300">
                        <tr>
                            <th>الاسم</th>
                            <th>التاريخ</th>
                            <th>الدرجة</th>
                            <th>الدرجة النهائية</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>الاختبار الاول</td>
                            <td>22/11</td>
                            <td>85%</td>
                            <td>100%</td>
                        </tr>
                    </tbody>
                </table>
            </Post>
            <Post
                title="أعلى درجة"
                body="100%"
                className={"col-span-1 row-span-1"}
            />
            <Post
                title="أقل درجة"
                body="85%"
                className={"col-span-1 row-span-1"}
            />
            </WidgetCont>
            <WidgetCont>
            <Post
                title="الواجبات"
                body=""
                className={"col-span-2 row-span-2"}
                showToggle={true}
                container={true}
            >
                <QuizBtn quizName="test" />
                <QuizBtn quizName="test" />
                <QuizBtn quizName="test" />
                <QuizBtn quizName="test" />
                <QuizBtn quizName="test" />
                <QuizBtn quizName="test" />
                <QuizBtn quizName="test" />
            </Post>
            <Post
                title="الحالة"
                body="تم التسليم (5/6)"
                className={"col-span-2 row-span-1"}
                state={true}
            />
            <Post
                title="واجب لم يتم تسليمه"
                body=""
                className={"col-span-2 row-span-1"}
                container={true}
            >
                <QuizBtn quizName="test" />
                <QuizBtn quizName="test" />
                <QuizBtn quizName="test" />
                <QuizBtn quizName="test" />
                <QuizBtn quizName="test" />
                <QuizBtn quizName="test" />
                <QuizBtn quizName="test" />
            </Post>
            </WidgetCont>
        </div>
        </div>
    </div>
    );
}

function WidgetCont({children}) {
    return (
        <div className="grid grid-cols-1 grid-cols-[1fr 1fr 1fr 1fr] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-rows-2 overflow-y-hidden gap-6 z-0 max-h-[40vh]">{children}</div>
    )
}

WidgetCont.propTypes = {
    children: PropTypes.node,
};

export default Student;
