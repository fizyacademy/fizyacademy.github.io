import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';

function Register() {
    const [username, setUsername] = useState("");
    const [arabic_name, setArabic_name] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [stage, setStage] = useState("1st_prep");
    const [studentPhone, setStudentPhone] = useState("");
    const [fatherPhone, setFatherPhone] = useState("");
    const [role, setRole] = useState("student");
    const [gender, setGender] = useState("male");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("كلمة المرور غير متطابقة");
            return;
        }

        const arabicRegex = /^[\u0600-\u06FF]{2,}(?:\s+[\u0600-\u06FF]{2,}){2,}$/;
        if (!arabicRegex.test(arabic_name)) {
            setError("يرجى إدخال اسم ثلاثي باللغة العربية فقط.");
            return;
        }

        const userData = {
            username,
            arabic_name,
            password,
            role,
        };
        userData.gender = gender;


        if (role === "student") {
            userData.email = email;
            userData.stage = stage;
            userData.student_phone = studentPhone;
            userData.father_phone = fatherPhone;
        }

        try {
            const response = await fetch("http://localhost:5000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "فشل التسجيل");

            alert("تم التسجيل بنجاح");
            navigate("/login");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-8 mt-16 mb-16">
                <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">إنشاء حساب جديد</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleRegister} className="space-y-4">

                    {/* الدور */}
                    <div className="relative">
                        <select
                            className="w-full p-3 border border-gray-300 rounded-md text-bold text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none pr-10"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="student">طالب</option>
                            <option value="moderator">مشرف</option>
                            <option value="admin">مدير</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* اختيار الجنس */}
                    <div className="relative">
                        <select
                            className="w-full p-3 border border-gray-300 rounded-md text-bold text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none pr-10"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required
                        >
                            <option value="male">ذكر</option>
                            <option value="female">أنثى</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {/* اسم المستخدم */}
                    <input
                        type="text"
                        placeholder="اسم المستخدم"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-bold text-teal-800"
                        required
                    />

                    {/* الاسم الثلاثي */}
                    <input
                        type="text"
                        placeholder="الاسم بالعربية ثلاثي"
                        value={arabic_name}
                        onChange={(e) => setArabic_name(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-bold text-teal-800"
                        required
                    />

                    {role === "student" && (
                        <>
                            {/* الإيميل */}
                            <input
                                type="email"
                                placeholder="البريد الإلكتروني"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-bold text-teal-800"
                                required
                            />
                            
                            {/* رقم الطالب */}
                            <label htmlFor="studentPhone">رقم الطالب</label>
                            <PhoneInput
                                id="studentPhone"
                                country="eg"
                                value={studentPhone}
                                onChange={setStudentPhone}
                                inputProps={{
                                    required: true,
                                    name: 'studentPhone',
                                    placeholder: "رقم هاتف الطالب",
                                }}
                                inputClass="!w-full !py-6 !px-4 !border !border-gray-300 !rounded-md !text-teal-800"
                                buttonClass="!w-15 !pr-7 !py-6 !px-4 !border !border-gray-300 !text-teal-800"
                                containerClass="!w-full"
                            />

                            {/* رقم ولي الأمر */}
                            <label htmlFor="fatherPhone">رقم ولي الأمر</label>
                            <PhoneInput
                                id="fatherPhone"
                                country="eg"
                                value={fatherPhone}
                                onChange={setFatherPhone}
                                inputProps={{
                                    required: true,
                                    name: 'fatherPhone',
                                    placeholder: "رقم ولي الأمر",
                                }}
                                inputClass="!w-full !py-6 !px-4 !border !border-gray-300 !rounded-md !text-teal-800"
                                buttonClass="!w-15 !pr-7 !py-6 !px-4 !border !border-gray-300 !text-teal-800"
                                containerClass="!w-full"
                            />

                            {/* المرحلة */}
                            <div className="relative">
                                <select
                                    value={stage}
                                    onChange={(e) => setStage(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md text-bold text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none pr-10"
                                    required
                                >
                                    <option value="1st_prep">أولى إعدادي</option>
                                    <option value="2nd_prep">ثانية إعدادي</option>
                                    <option value="3rd_prep">ثالثة إعدادي</option>
                                    <option value="1st_sec">أولى ثانوي</option>
                                    <option value="2nd_sec">ثانية ثانوي</option>
                                    <option value="3rd_sec">ثالثة ثانوي</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </>
                    )}

                    {/* كلمة المرور */}
                    <input
                        type="password"
                        placeholder="كلمة المرور"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-bold text-teal-800"
                        required
                    />

                    <input
                        type="password"
                        placeholder="تأكيد كلمة المرور"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-bold text-teal-800"
                        required
                    />

                    {/* زر التسجيل */}
                    <button
                        type="submit"
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-md font-semibold transition"
                    >
                        إنشاء الحساب
                    </button>
                </form>

                <p className="mt-4 text-center text-gray-700">
                    لديك حساب؟{" "}
                    <a href="/login" className="text-teal-700 hover:underline">
                        سجل الدخول
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Register;
