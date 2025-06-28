import { useState } from 'react';
import PropTypes from "prop-types";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";
import AccountInfo from "../components/AccountInfo";
import {username} from "../utils";
import AdminApproval from "../components/AdminApproval";


function Admin() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="App w-full h-[100vh] bg-gray-200 overflow-y-auto overflow-x-hidden relative">
        <Navbar />
        <div className="flex flex-col sm:flex-row justify-between gap-7 m-0">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className={`flex flex-col gap-7 left-0 top-[8vh] absolute p-7 ${isCollapsed ? "w-[95vw]" : "w-[80vw]"}`}>
            <WidgetCont>
                <Post
                    title={"الحساب (مسؤول)"}
                    body=""
                    className={"col-span-4 row-span-2"}
                    container={true}
                    showToggle={true}
                >
                    <AccountInfo/>
                </Post>
            </WidgetCont>
            {username == "admin" ?(
            <WidgetCont>
                <Post
                    title="المسؤولين"
                    body=""
                    className={"col-span-2 row-span-2"}
                    showToggle={true}
                    container={true}
                >
                    <table>
                        <thead className="bg-gray-300">
                            <tr>
                                <th>الاسم</th>
                                <th>الحالة</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            <tr>
                                <td>مسؤول 1</td>
                                <td>نشط</td>
                            </tr>
                            <tr>
                                <td>مسؤول 2</td>
                                <td>غير نشط</td>
                            </tr>
                            <tr>
                                <td>مسؤول 3</td>
                                <td>نشط</td>
                            </tr>
                            <tr>
                                <td>مسؤول 4</td>
                                <td>غير نشط</td>
                            </tr>
                            <tr>
                                <td>مسؤول 5</td>
                                <td>غير نشط</td>
                            </tr>
                            <tr>
                                <td>مسؤول 6</td>
                                <td>غير نشط</td>
                            </tr>
                            <tr>
                                <td>مسؤول 7</td>
                                <td>غير نشط</td>
                            </tr>
                            <tr>
                                <td>مسؤول 8</td>
                                <td>غير نشط</td>
                            </tr>
                            <tr>
                                <td>مسؤول 8</td>
                                <td>غير نشط</td>
                            </tr>
                            <tr>
                                <td>مسؤول 9</td>
                                <td>غير نشط</td>
                            </tr>
                        </tbody>
                    </table>
                </Post>
                <Post
                    title="طلبات المسؤولين"
                    body=""
                    className={"col-span-2 row-span-2"}
                    container={true}
                >
                    <table>
                        <thead className="bg-gray-300">
                            <tr>
                                <th>اسم المسؤول</th>
                                <th>عنوان الطلب</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            <tr>
                                <td>مسؤول 1</td>
                                <td>اجازة</td>
                                <td><a className="text-blue-800 hover:text-blue-950 cursor-pointer">الطلب</a></td>
                            </tr>
                            <tr>
                                <td>مسؤول 2</td>
                                <td>استقالة</td>
                                <td><a className="text-blue-800 hover:text-blue-950 cursor-pointer">الطلب</a></td>
                            </tr>
                        </tbody>
                    </table>
                </Post>
            </WidgetCont>
            ) : ""
            } 

            <WidgetCont>
                <Post
                    title="المشرفيين"
                    body=""
                    className={"col-span-2 row-span-2"}
                    showToggle={true}
                    container={true}
                >
                    <table>
                        <thead className="bg-gray-300">
                            <tr>
                                <th>الاسم</th>
                                <th>الحالة</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            <tr>
                                <td>مشرف 1</td>
                                <td>نشط</td>
                            </tr>
                            <tr>
                                <td>مشرف 2</td>
                                <td>غير نشط</td>
                            </tr>
                            <tr>
                                <td>مشرف 3</td>
                                <td>نشط</td>
                            </tr>
                            <tr>
                                <td>مشرف 4</td>
                                <td>غير نشط</td>
                            </tr>
                            <tr>
                                <td>مشرف 5</td>
                                <td>غير نشط</td>
                            </tr>
                            <tr>
                                <td>مشرف 6</td>
                                <td>غير نشط</td>
                            </tr>
                            <tr>
                                <td>مشرف 7</td>
                                <td>غير نشط</td>
                            </tr>
                            <tr>
                                <td>مشرف 8</td>
                                <td>غير نشط</td>
                            </tr>
                            <tr>
                                <td>مشرف 8</td>
                                <td>غير نشط</td>
                            </tr>
                            <tr>
                                <td>مشرف 9</td>
                                <td>غير نشط</td>
                            </tr>
                        </tbody>
                    </table>
                </Post>
                <Post
                    title="طلبات المشرفين"
                    body=""
                    className={"col-span-2 row-span-2"}
                    container={true}
                >
                    <table>
                        <thead className="bg-gray-300">
                            <tr>
                                <th>اسم المشرف</th>
                                <th>عنوان الطلب</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            <tr>
                                <td>مشرف 1</td>
                                <td>اجازة</td>
                                <td><a className="text-blue-800 hover:text-blue-950 cursor-pointer">الطلب</a></td>
                            </tr>
                            <tr>
                                <td>مشرف 2</td>
                                <td>استقالة</td>
                                <td><a className="text-blue-800 hover:text-blue-950 cursor-pointer">الطلب</a></td>
                            </tr>
                        </tbody>
                    </table>
                </Post>
            </WidgetCont>

            <div className="bg-gray-50 rounded-2xl flex flex-col p-3">
                <select name="" id="" className="bg-gray-50 rounded-2xl  text-black outline-none cursor-pointer">
                        <option value="1" className="bg-gray-50">الكل</option>
                        <option value="1" className="bg-gray-50">الصف الأول الثانوي</option>
                        <option value="1" className="bg-gray-50">الصف الثاني الثانوي</option>
                        <option value="1" className="bg-gray-50">الصف الثالث الثانوي</option>
                </select>
            </div>

            <WidgetCont>
                <Post
                    title="الطلاب"
                    body=""
                    className={"col-span-2 row-span-2"}
                    showToggle={true}
                    container={true}
                >
                    <table>
                        <thead className="bg-gray-300">
                            <tr>
                                <th>الاسم</th>
                                <th>الصف</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            <tr>
                                <td>طالب 1</td>
                                <td>الثالث الثانوي</td>
                            </tr>
                            <tr>
                                <td>طالب 2</td>
                                <td>الثاني الثانوي</td>
                            </tr>
                            <tr>
                                <td>طالب 3</td>
                                <td>الثالث الثانوي</td>
                            </tr>
                            <tr>
                                <td>طالب 4</td>
                                <td>الثاني الثانوي</td>
                            </tr>
                            <tr>
                                <td>طالب 5</td>
                                <td>الثاني الثانوي</td>
                            </tr>
                            <tr>
                                <td>طالب 6</td>
                                <td>الثاني الثانوي</td>
                            </tr>
                            <tr>
                                <td>طالب 7</td>
                                <td>الثاني الثانوي</td>
                            </tr>
                            <tr>
                                <td>طالب 8</td>
                                <td>الثاني الثانوي</td>
                            </tr>
                            <tr>
                                <td>طالب 9</td>
                                <td>الثاني الثانوي</td>
                            </tr>
                            <tr>
                                <td>طالب 10</td>
                                <td>الثاني الثانوي</td>
                            </tr>
                        </tbody>
                    </table>
                </Post>
                <Post
                    title="الطلاب المتفوقين"
                    body=""
                    className={"col-span-2 row-span-2"}
                    container={true}
                >
                    <table>
                        <thead className="bg-gray-300">
                            <tr>
                                <th>اسم الطالب</th>
                                <th>التقييم الاجمالي</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            <tr>
                                <td>طالب 1</td>
                                <td>100%</td>
                                <td><a className="text-blue-800 hover:text-blue-950 cursor-pointer">محادثة</a></td>
                            </tr>
                            <tr>
                                <td>طالب 2</td>
                                <td>99%</td>
                                <td><a className="text-blue-800 hover:text-blue-950 cursor-pointer">محادثة</a></td>
                            </tr>
                        </tbody>
                    </table>
                </Post>
            </WidgetCont>
            <WidgetCont>
                <Post
                    title="الطلاب المتوسطين"
                    body=""
                    className={"col-span-2 row-span-2"}
                    container={true}
                >
                    <table>
                        <thead className="bg-gray-300">
                            <tr>
                                <th>اسم الطالب</th>
                                <th>التقييم الاجمالي</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            <tr>
                                <td>طالب 4</td>
                                <td>60%</td>
                                <td><a className="text-blue-800 hover:text-blue-950 cursor-pointer">محادثة</a></td>
                            </tr>
                            <tr>
                                <td>طالب 3</td>
                                <td>50%</td>
                                <td><a className="text-blue-800 hover:text-blue-950 cursor-pointer">محادثة</a></td>
                            </tr>
                        </tbody>
                    </table>
                </Post>
                <Post
                    title="الطلاب الضعاف"
                    body=""
                    className={"col-span-2 row-span-2"}
                    container={true}
                >
                    <table>
                        <thead className="bg-gray-300">
                            <tr>
                                <th>اسم الطالب</th>
                                <th>التقييم الاجمالي</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            <tr>
                                <td>طالب 6</td>
                                <td>40%</td>
                                <td><a className="text-blue-800 hover:text-blue-950 cursor-pointer">محادثة</a></td>
                            </tr>
                            <tr>
                                <td>طالب 7</td>
                                <td>20%</td>
                                <td><a className="text-blue-800 hover:text-blue-950 cursor-pointer">محادثة</a></td>
                            </tr>
                        </tbody>
                    </table>
                </Post>
            </WidgetCont>
            <WidgetCont>
                <Post
                    title="الاختبارات"
                    body=""
                    className={"col-span-2 row-span-2"}
                    container={true}
                    showToggle={true}
                >
                    <table>
                        <thead className="bg-gray-300">
                            <tr>
                                <th>العنوان</th>
                                <th>الصف</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            <tr>
                                <td>الإختبار الأول</td>
                                <td>الثالث الثانوي</td>
                                <td><a className="text-blue-800 hover:text-blue-950 cursor-pointer">الإجراءات</a></td>
                            </tr>
                            <tr>
                                <td>الإختبار الأول</td>
                                <td>الأول الثانوي</td>
                                <td><a className="text-blue-800 hover:text-blue-950 cursor-pointer">الإجراءات</a></td>
                            </tr>
                        </tbody>
                    </table>
                </Post>
                <Post
                    title="الواجبات"
                    body=""
                    className={"col-span-2 row-span-2"}
                    container={true}
                    showToggle={true}
                >
                    <table>
                        <thead className="bg-gray-300">
                            <tr>
                                <th>العنوان</th>
                                <th>الصف</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            <tr>
                                <td>الواجب الأول</td>
                                <td>الثالث الثانوي</td>
                                <td><a className="text-blue-800 hover:text-blue-950 cursor-pointer">الإجراءات</a></td>
                            </tr>
                            <tr>
                                <td>الواجب الأول</td>
                                <td>الأول الثانوي</td>
                                <td><a className="text-blue-800 hover:text-blue-950 cursor-pointer">الإجراءات</a></td>
                            </tr>
                        </tbody>
                    </table>
                </Post>
            </WidgetCont>
            {username == "admin" ?(
            <div>
                <AdminApproval/>
            </div>
            ):""}
        </div>
        </div>
    </div>
    )
}

function WidgetCont({children}) {
    return (
        <div className={"grid grid-cols-1 grid-cols-[1fr 1fr 1fr 1fr] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-rows-2 overflow-y-hidden gap-6 z-0 max-h-[40vh]"}>{children}</div>
    )
}

WidgetCont.propTypes = {
    children: PropTypes.node,
};

export default Admin