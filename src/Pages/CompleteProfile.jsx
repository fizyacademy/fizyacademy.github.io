import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  FiUser, FiMail, FiPhone, FiBook, FiLock, FiCheck, FiEye, FiEyeOff,
} from "react-icons/fi";
import ThemeToggle from "../components/ThemeToggle";
import CustomSelect from "../components/CustomSelect";
import { useAuth } from "../AuthContext";
import { showError, showPromise } from "../components/Toast";

function CompleteProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [arabic_name, setArabicName] = useState("");
  const [password, setPassword] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [fatherPhone, setFatherPhone] = useState("");
  const [stage, setStage] = useState("1st_sec");
  const [gender, setGender] = useState("male");
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.email) setEmail(user.email);
      if (user.student_phone) setStudentPhone(user.student_phone);
    }
  }, [user]);

  const handleComplete = async (e) => {
    e.preventDefault();

    const arabicRegex = /^[\u0600-\u06FF]{2,}(?:\s+[\u0600-\u06FF]{2,}){2,}$/;
    if (!arabicRegex.test(arabic_name)) {
      showError("يرجى إدخال اسم ثلاثي باللغة العربية فقط.");
      return;
    }

    if (!password || password.length < 6) {
      showError("كلمة المرور مطلوبة ويجب أن تكون 6 أحرف على الأقل.");
      return;
    }

    const data = {
      arabic_name,
      password,
      role,
      gender,
    };

    if (role === "student") {
      data.stage = stage;
      data.student_phone = studentPhone;
      data.father_phone = fatherPhone;
    }

    try {
      await showPromise(
        fetch("http://localhost:5000/auth/complete-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        }).then(async (res) => {
          const result = await res.json();
          if (!res.ok) throw new Error(result.message || "فشل إكمال البيانات");
          return result;
        }),
        {
          loading: "جارٍ إكمال البيانات...",
          success: "تم إكمال البيانات بنجاح",
          error: (err) => err.message || "حدث خطأ",
        }
      );

      setUser((prev) => ({ ...prev, is_complete: true }));
      navigate("/");
    } catch {
      // الخطأ تم عرضه بالتوست
    }
  };

  const renderInput = (label, icon, type, value, onChange, placeholder = "", readOnly = false) => (
    <div>
      <label className="block mb-1 text-sm sm:text-base text-gray-800 dark:text-white">{label}</label>
      <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-gray-300 dark:border-gray-600 rounded-md px-3 shadow-inner">
        <span className="text-xl text-violet-600 dark:text-violet-400">{icon}</span>
        <input
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          required
          className="w-full bg-transparent text-gray-800 dark:text-white focus:outline-none py-3"
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-violet-600 dark:text-violet-400 focus:outline-none cursor-pointer"
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
      <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-gray-300 dark:border-gray-600 rounded-md px-2 shadow-inner">
        <span className="text-xl text-violet-600 dark:text-violet-400">
          <FiPhone />
        </span>
        <div className="w-full">
          <PhoneInput
            country="eg"
            value={value}
            onChange={onChange}
            inputProps={{ name, required: true }}
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
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-violet-700 dark:text-violet-300">
            إكمال البيانات
          </h2>
          <ThemeToggle />
        </div>

        <form onSubmit={handleComplete} className="space-y-4">
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

          {renderInput("البريد الإلكتروني", <FiMail />, "email", email, () => {}, "البريد الإلكتروني", true)}
          {renderInput("الاسم بالعربية ثلاثي", <FiUser />, "text", arabic_name, (e) => setArabicName(e.target.value), "الاسم الكامل بالعربية")}

          {role === "student" && (
            <>
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

          {renderInput("انشاء كلمة مرور", <FiLock />, "password", password, (e) => setPassword(e.target.value), "كلمة المرور")}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-md font-semibold transition cursor-pointer"
          >
            <FiCheck className="text-xl" />
            إكمال البيانات
          </button>
        </form>
      </div>
    </div>
  );
}

export default CompleteProfile;
