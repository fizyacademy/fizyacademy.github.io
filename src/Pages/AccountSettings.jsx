import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import PasswordModal from "../components/PasswordModal";
import AvatarModal from "../components/AvatarModal";

const BASE_URL = "http://localhost:5000";

const stageOptions = [
  { value: "1st_prep", label: "الصف الأول الإعدادي" },
  { value: "2nd_prep", label: "الصف الثاني الإعدادي" },
  { value: "3rd_prep", label: "الصف الثالث الإعدادي" },
  { value: "1st_sec", label: "الصف الأول الثانوي" },
  { value: "2nd_sec", label: "الصف الثاني الثانوي" },
  { value: "3rd_sec", label: "الصف الثالث الثانوي" },
];

const avatarImages = {
  boy_1: "/avatars/boy_1.png",
  girl_1: "/avatars/girl_1.png",
  boy_2: "/avatars/boy_2.png",
  girl_2: "/avatars/girl_2.png",
  boy_3: "/avatars/boy_3.png",
  girl_3: "/avatars/girl_3.png",
  boy_4: "/avatars/boy_4.png",
  girl_4: "/avatars/girl_4.png",
  boy_5: "/avatars/boy_5.png",
  girl_5: "/avatars/girl_5.png",
};


const AccountSettings = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [editFields, setEditFields] = useState({});
  const [message, setMessage] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  
  useEffect(() => {
    fetch(`${BASE_URL}/auth/me`, {
      method: "GET",
      credentials: "include",
    })
    .then((res) => res.json())
    .then((data) => {
      setUser(data.user);
      setFormData({
        arabic_name: data.user.arabic_name || "",
        student_phone: data.user.student_phone || "",
        father_phone: data.user.father_phone || "",
        stage: data.user.stage || "",
        email: data.user.email || "",
        avatar: data.user.avatar || "boy_1",
      });
    })
    .catch(() => setMessage("❌ فشل تحميل البيانات"));
  }, []);
  
  const isEditable = (field) => {
    if (!user) return false;
    if (field === "arabic_name") return true;
    if (user.role === "student") return true;
    return false;
  };

  
  const toggleEdit = (field) =>
    setEditFields((prev) => ({ ...prev, [field]: !prev[field] }));
  
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch(`${BASE_URL}/account/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("✅ تم الحفظ بنجاح");
      setEditFields({});
    } else {
      setMessage("❌ " + data.message);
    }
  };

  const renderInput = (name, label, type = "text") => (
    <div>
      <label className="block mb-1 text-gray-700">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          disabled={!editFields[name]}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-teal-800 disabled:bg-gray-100"
        />
        {isEditable(name) && (
          <button
            type="button"
            onClick={() => toggleEdit(name)}
            className="text-sm text-blue-600 underline"
          >
            {editFields[name] ? "إلغاء" : "تعديل"}
          </button>
        )}
      </div>
    </div>
  );

  const renderPhone = (field, label) => (
    <div>
      <label className="block mb-1 text-gray-700">{label}</label>
      <div className="flex items-center gap-2">
        <PhoneInput
          country="eg"
          value={formData[field]}
          onChange={(val) => setFormData({ ...formData, [field]: val })}
          inputProps={{
            name: field,
            required: true,
            disabled: !editFields[field],
          }}
          inputClass="!w-full !py-6 !px-4 !border !border-gray-300 !rounded-md !text-teal-800"
          buttonClass="!w-15 !pr-7 !py-6 !px-4 !border !border-gray-300 !text-teal-800"
          containerClass="!w-full"
        />
          {isEditable(field) && (
          <button
            type="button"
            onClick={() => toggleEdit(field)}
            className="text-sm text-blue-600 underline"
          >
            {editFields[field] ? "إلغاء" : "تعديل"}
          </button>
        )}
      </div>
    </div>
  );

  const renderStage = () => (
    <div>
      <label className="block mb-1 text-gray-700">المرحلة الدراسية</label>
      <div className="flex items-center gap-2">
        <select
          name="stage"
          value={formData.stage}
          onChange={handleChange}
          disabled={!editFields.stage}
          className="w-full p-3 border border-gray-300 rounded-md text-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
        >
          <option value="">اختر المرحلة</option>
          {stageOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        {isEditable("stage") && (
          <button
            type="button"
            onClick={() => toggleEdit("stage")}
            className="text-sm text-blue-600 underline"
          >
            {editFields["stage"] ? "إلغاء" : "تعديل"}
          </button>
        )}
      </div>
    </div>
  );

  if (!user) return <p className="text-center mt-10">...جاري التحميل</p>;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl p-8 flex flex-col md:flex-row gap-10">
        {/* Right - Avatar */}
        <div className="flex flex-col items-center">
          <div className="relative group cursor-pointer" onClick={() => setShowAvatarModal(true)}>
            <img
              src={avatarImages[formData.avatar]}
              alt="avatar"
              className="w-32 h-32 rounded-full border-4 border-teal-500"
            />
            <div className="absolute inset-0 rounded-full bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <span className="text-white">تغيير</span>
            </div>
          </div>
        </div>

        {/* Left - Form */}
        <div className="flex-1 space-y-5">
          <h2 className="text-2xl font-bold text-gray-800 text-center md:text-right">إعدادات الحساب</h2>
          <form onSubmit={handleUpdate} className="space-y-4">
            {renderInput("arabic_name", "الاسم بالعربية")}
            {renderInput("email", "البريد الإلكتروني")}
            {renderPhone("student_phone", "رقم الطالب")}
            {renderPhone("father_phone", "رقم ولي الأمر")}
            {renderStage()}
            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-md font-semibold transition"
            >
              حفظ التغييرات
            </button>
          </form>
          {message && <p className="text-center font-black mt-4 text-teal-700">{message}</p>}

          <div className="text-center mt-6">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded"
            >
              تغيير كلمة المرور
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPasswordModal && <PasswordModal onClose={() => setShowPasswordModal(false)} />}
      {showAvatarModal && (
        <AvatarModal
          currentAvatar={formData.avatar}
          onSelect={(avatar) => {
            setFormData({ ...formData, avatar });
            setShowAvatarModal(false);
          }}
          onClose={() => setShowAvatarModal(false)}
        />
      )}
    </div>
  );
};

export default AccountSettings;
