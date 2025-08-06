// Register.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import {
  FiUser, FiMail, FiPhone, FiBook, FiLock, FiCheck, FiEye, FiEyeOff
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import ThemeToggle from "../components/ThemeToggle";
import CustomSelect from "../components/CustomSelect";
import { useAuth } from "../AuthContext";
import { showError, showPromise } from "../components/Toast";

function Register() {
  const [username, setUsername] = useState("");
  const [arabic_name, setArabic_name] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [stage, setStage] = useState("1st_sec");
  const [studentPhone, setStudentPhone] = useState("");
  const [fatherPhone, setFatherPhone] = useState("");
  const [role, setRole] = useState("student");
  const [gender, setGender] = useState("male");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showError("كلمة المرور غير متطابقة");
      return;
    }

    const arabicRegex = /^[\u0600-\u06FF]{2,}(?:\s+[\u0600-\u06FF]{2,}){2,}$/;
    if (!arabicRegex.test(arabic_name)) {
      showError("يرجى إدخال اسم ثلاثي باللغة العربية فقط.");
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
      await showPromise(
        fetch("http://localhost:5000/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }).then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "فشل التسجيل");
          return data;
        }),
        {
          loading: "جارٍ إنشاء الحساب...",
          success: "تم إنشاء الحساب بنجاح",
          error: (err) => err.message || "حدث خطأ أثناء التسجيل",
        }
      );

      const result = await login(username, password);
      if (result.success) navigate("/");
      else navigate("/login");
    } catch {
      // Error handling is done in showPromise
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = "http://localhost:5000/auth/google-login";
  };


  const renderInput = (label, icon, type, value, onChange) => (
    <div>
      <label className="block mb-1 text-sm text-gray-800 dark:text-white">{label}</label>
      <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 rounded-md px-3 shadow-inner">
        <span className="text-xl text-violet-600 dark:text-violet-400">{icon}</span>
        <input
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          required
          placeholder={label}
          className="w-full bg-transparent text-gray-800 dark:text-white py-3 focus:outline-none"
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-violet-600 dark:text-violet-400 cursor-pointer"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>
    </div>
  );

  const renderPhone = (value, onChange, name, label) => (
    <div>
      <label className="block mb-1 text-gray-800 dark:text-white">{label}</label>
      <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 rounded-md px-2 shadow-inner">
        <span className="text-xl text-violet-600 dark:text-violet-400">
          <FiPhone />
        </span>
        <div className="w-full">
          <PhoneInput
            country="eg"
            value={value}
            onChange={onChange}
            inputProps={{ name, required: true, placeholder: label }}
            inputClass="!pl-[0px] !w-full !bg-transparent py-6 !text-gray-800 dark:!text-white !border-none !shadow-none !outline-none"
            containerClass="!w-full !bg-transparent !border-none !shadow-none"
            buttonClass="!bg-transparent !border-none mr-5 hover:!bg-transparent"
            dropdownClass="!bg-white dark:!bg-gray-700 !text-gray-800 dark:!text-white"
            dropdownStyle={{ position: "absolute", top: "auto", bottom: "100%", zIndex: 9999 }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 to-white dark:from-gray-900 dark:to-gray-800 px-4 py-10 flex items-center justify-center text-gray-900 dark:text-white">
      <div className="bg-white/70 dark:bg-gray-900/80 backdrop-blur rounded-xl shadow-xl w-full max-w-2xl p-6 sm:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-violet-700 dark:text-violet-300">إنشاء حساب باستخدام جوجل</h2>
          <ThemeToggle />
        </div>

        <button
          onClick={handleGoogleRegister}
          type="button"
          className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md py-2 font-medium transition cursor-pointer"
        >
          <FcGoogle className="text-xl" />
          التسجيل باستخدام Google
        </button>

        <form onSubmit={handleRegister} className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-violet-700 dark:text-violet-300">أو إنشاء حساب جديد</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomSelect
              label="اختر الدور"
              value={role}
              onChange={setRole}
              options={[
                { value: "student", label: "طالب" },
                { value: "moderator", label: "مشرف" },
                { value: "admin", label: "مدير" },
              ]}
            />

            <CustomSelect
              label="الجنس"
              value={gender}
              onChange={setGender}
              options={[
                { value: "male", label: "ذكر" },
                { value: "female", label: "أنثى" },
              ]}
            />
          </div>

          {renderInput("اسم المستخدم", <FiUser />, "text", username, (e) => setUsername(e.target.value))}
          {renderInput("الاسم بالعربية ثلاثي", <FiUser />, "text", arabic_name, (e) => setArabic_name(e.target.value))}

          {role === "student" && (
            <>
              {renderInput("البريد الإلكتروني", <FiMail />, "email", email, (e) => setEmail(e.target.value))}
              {renderPhone(studentPhone, setStudentPhone, "studentPhone", "رقم الطالب")}
              {renderPhone(fatherPhone, setFatherPhone, "fatherPhone", "رقم ولي الأمر")}

              <CustomSelect
                icon={<FiBook />}
                label="المرحلة الدراسية"
                value={stage}
                onChange={setStage}
                options={[
                  { value: "1st_sec", label: "أولى ثانوي" },
                  { value: "2nd_sec", label: "ثانية ثانوي" },
                  { value: "3rd_sec", label: "ثالثة ثانوي" },
                ]}
              />
            </>
          )}

          {renderInput("كلمة المرور", <FiLock />, "password", password, (e) => setPassword(e.target.value))}
          {renderInput("تأكيد كلمة المرور", <FiLock />, "password", confirmPassword, (e) => setConfirmPassword(e.target.value))}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-md font-semibold transition cursor-pointer"
          >
            <FiCheck className="text-xl" />
            إنشاء الحساب
          </button>
        </form>

        <p className="text-center text-sm text-gray-700 dark:text-gray-300">
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
