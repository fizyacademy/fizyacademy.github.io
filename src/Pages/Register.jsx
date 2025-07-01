import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiUsers,
  FiLock,
  FiCheck,
} from "react-icons/fi";
import ThemeToggle from "../components/ThemeToggle";

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
      gender,
    };

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

  const renderInput = (label, icon, type, value, onChange) => (
    <div>
      <label className="block mb-1 text-sm sm:text-base text-gray-800 dark:text-white">
        {label}
      </label>
      <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-gray-300 dark:border-gray-600 rounded-md p-3 shadow-inner">
        <span className="text-xl text-violet-600 dark:text-violet-400">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={onChange}
          required
          className="w-full bg-transparent text-gray-800 dark:text-white focus:outline-none"
        />
      </div>
    </div>
  );

  const renderPhone = (value, onChange, name, label) => (
  <div>
    <label className="block mb-1 text-gray-800 dark:text-white">{label}</label>
    <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-gray-300 dark:border-gray-600 rounded-md p-2 shadow-inner">
      <span className="text-xl text-violet-600 dark:text-violet-400">
        <FiPhone />
      </span>
      <div className="w-full">
        <PhoneInput
          country="eg"
          value={value}
          onChange={onChange}
          inputProps={{
            name,
            required: true,
          }}
          inputClass="!pl-[0px] !w-full !bg-transparent !text-gray-800 dark:!text-white !border-none !shadow-none !outline-none !ring-0 focus:!ring-0 focus:!outline-none"
          containerClass="!w-full !bg-transparent !border-none !shadow-none"
          buttonClass="!bg-transparent !border-none mr-5 hover:!bg-transparent focus:!bg-transparent active:!bg-transparent"
          dropdownClass="!bg-white dark:!bg-gray-700 !text-gray-800 dark:!text-white"
          dropdownStyle={{
            position: "absolute",
            top: "auto",
            bottom: "100%",
            zIndex: 9999,
          }}
        />
      </div>
    </div>
  </div>
);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 to-white dark:from-gray-900 dark:to-gray-800 px-4 py-10 flex items-center justify-center text-gray-900 dark:text-white">
      <div className="bg-white/70 dark:bg-gray-900/80 backdrop-blur rounded-xl shadow-xl w-full max-w-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-violet-700 dark:text-violet-300">
            إنشاء حساب جديد
          </h2>
          <ThemeToggle />
        </div>

        {error && (
          <p className="text-center font-semibold text-red-500 dark:text-red-400">
            {error}
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* الدور */}
            <div>
              <label className="block mb-1 text-sm sm:text-base text-gray-800 dark:text-white">
                اختر الدور
              </label>
              <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-gray-300 dark:border-gray-600 rounded-md p-3 shadow-inner">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full outline-none bg-transparent text-gray-800 dark:text-white focus:outline-none cursor-pointer"
                >
                <option value="student">طالب</option>
                <option value="moderator">مشرف</option>
                <option value="admin">مدير</option>
              </select>
            </div>
            </div>

            {/* الجنس */}
            <div>
              <label className="block mb-1 text-sm sm:text-base text-gray-800 dark:text-white">
                الجنس
              </label>
              <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-gray-300 dark:border-gray-600 rounded-md p-3 shadow-inner">
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full outline-none bg-transparent text-gray-800 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
              </div>
            </div>
          </div>

          {renderInput("اسم المستخدم", <FiUser />, "text", username, (e) => setUsername(e.target.value))}
          {renderInput("الاسم بالعربية ثلاثي", <FiUser />, "text", arabic_name, (e) => setArabic_name(e.target.value))}

          {role === "student" && (
            <>
            {renderInput("البريد الإلكتروني", <FiMail />, "email", email, (e) => setEmail(e.target.value))}
              {/* رقم الطالب */}
            {renderPhone(studentPhone, setStudentPhone, "studentPhone", "رقم الطالب")}

            {/* رقم ولي الأمر */}
            {renderPhone(fatherPhone, setFatherPhone, "fatherPhone", "رقم ولي الأمر")}

              {/* المرحلة */}
              <div>
                <label className="block mb-1 text-sm sm:text-base text-gray-800 dark:text-white">
                  المرحلة الدراسية
                </label>
                <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-gray-300 dark:border-gray-600 rounded-md p-3 shadow-inner">
                  <span className="text-xl text-violet-600 dark:text-violet-400"><FiUsers /></span>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full bg-transparent text-gray-800 dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="1st_prep">أولى إعدادي</option>
                    <option value="2nd_prep">ثانية إعدادي</option>
                    <option value="3rd_prep">ثالثة إعدادي</option>
                    <option value="1st_sec">أولى ثانوي</option>
                    <option value="2nd_sec">ثانية ثانوي</option>
                    <option value="3rd_sec">ثالثة ثانوي</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {renderInput("كلمة المرور", <FiLock />, "password", password, (e) => setPassword(e.target.value))}
          {renderInput("تأكيد كلمة المرور", <FiLock />, "password", confirmPassword, (e) => setConfirmPassword(e.target.value))}

          {/* زر التسجيل */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-md font-semibold transition cursor-pointer"
          >
            <FiCheck className="text-xl" />
            إنشاء الحساب
          </button>
        </form>

        <p className="text-center text-sm sm:text-base text-gray-700 dark:text-gray-300">
          لديك حساب؟{" "}
          <a href="/login" className="text-violet-600 hover:underline dark:text-violet-400">
            سجل الدخول
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
