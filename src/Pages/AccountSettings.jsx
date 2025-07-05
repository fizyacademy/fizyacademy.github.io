// AccountSettings.jsx

import { useEffect, useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCheck,
  FiEdit,
  FiLock,
  FiBook,
} from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import PasswordModal from "../components/PasswordModal";
import AvatarModal from "../components/AvatarModal";
import Loading from "../components/Loading";
import ThemeToggle from "../components/ThemeToggle";
import CustomSelect from "../components/CustomSelect";

const BASE_URL = "http://localhost:5000";

const stageOptions = [
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

  const renderInput = (name, label, icon, type = "text") => (
    <div>
      <label className="block mb-1 text-gray-800 dark:text-white">{label}</label>
      <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-gray-300 dark:border-gray-600 rounded-md px-3 shadow-inner">
        <span className="text-xl text-violet-600 dark:text-violet-400">{icon}</span>
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          disabled={!editFields[name]}
          className="w-full bg-transparent text-gray-800 dark:text-white focus:outline-none disabled:text-gray-400 py-3"
        />
        {isEditable(name) && (
          <>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
            <button
              type="button"
              onClick={() => toggleEdit(name)}
              className="text-sm text-blue-600 underline cursor-pointer"
            >
              {editFields[name] ? <IoClose /> : <FiEdit />}
            </button>
          </>
        )}
      </div>
    </div>
  );

  const renderPhone = (field, label, icon) => (
    <div>
      <label className="block mb-1 text-gray-800 dark:text-white">{label}</label>
      <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-gray-300 dark:border-gray-600 rounded-md px-2 shadow-inner">
        <span className="text-xl text-violet-600 dark:text-violet-400">{icon}</span>
        <div className="w-full">
          <PhoneInput
            country="eg"
            value={formData[field]}
            onChange={(val) => setFormData({ ...formData, [field]: val })}
            inputProps={{
              name: field,
              required: true,
              disabled: !editFields[field],
            }}
            inputClass="!pl-[0px] !w-full !bg-transparent !text-gray-800 dark:!text-white !border-none !shadow-none !outline-none !ring-0 focus:!ring-0 focus:!outline-none disabled:!text-gray-400 disabled:!cursor-default !py-6"
            containerClass="!w-full !bg-transparent !border-none !shadow-none"
            buttonClass="!bg-transparent !border-none mr-5 cursor-pointer disabled:cursor-default"
            dropdownClass="!bg-white dark:!bg-gray-700 !text-gray-800 dark:!text-white"
            dropdownStyle={{
              position: "absolute",
              top: "auto",
              bottom: "100%",
              zIndex: 9999,
            }}
          />
        </div>
        {isEditable(field) && (
          <>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
            <button
              type="button"
              onClick={() => toggleEdit(field)}
              className="text-sm text-blue-600 underline cursor-pointer pl-[5px]"
              >
              {editFields[field] ? <IoClose /> : <FiEdit />}
            </button>
          </>
        )}
      </div>
    </div>
  );

const renderStage = () => (
  <div>
    <label className="block mb-1 text-gray-800 dark:text-white">المرحلة الدراسية</label>
    <CustomSelect
      value={formData.stage}
      onChange={(val) => setFormData({ ...formData, stage: val })}
      options={stageOptions}
      icon={<FiBook />}
      isDisabled={!editFields.stage}
      editButton={
        isEditable("stage") && (
          <button
            type="button"
            onClick={() => toggleEdit("stage")}
            className="text-sm text-blue-600 underline cursor-pointer"
          >
            {editFields["stage"] ? <IoClose /> : <FiEdit />}
          </button>
        )
      }
    />
  </div>
);



  if (!user) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 to-white dark:from-gray-900 dark:to-gray-800 px-4 py-10 flex justify-center items-center text-gray-900 dark:text-white">
      <div className="bg-white/70 dark:bg-gray-900/80 backdrop-blur rounded-xl shadow-xl w-full max-w-5xl p-8 flex flex-col md:flex-row gap-10">
        <div className="flex flex-col items-center">
          <div
            className="relative group cursor-pointer"
            onClick={() => setShowAvatarModal(true)}
          >
            <img
              src={avatarImages[formData.avatar]}
              alt="avatar"
              className="w-32 h-32 rounded-full border-4 border-violet-600"
            />
            <div className="absolute inset-0 rounded-full bg-black/70 bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <span className="text-white">تغيير</span>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-violet-700 dark:text-violet-300">
              إعدادات الحساب
            </h2>
            <ThemeToggle />
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">
            {renderInput("arabic_name", "الاسم بالعربية", <FiUser />)}
            {renderInput("email", "البريد الإلكتروني", <FiMail />, "email")}
            {renderPhone("student_phone", "رقم الطالب", <FiPhone />)}
            {renderPhone("father_phone", "رقم ولي الأمر", <FiPhone />)}
            {renderStage()}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-md font-semibold transition cursor-pointer"
            >
              <FiCheck /> حفظ التغييرات
            </button>
          </form>

          {message && (
            <p className="text-center font-bold mt-4 text-violet-700 dark:text-violet-300">
              {message}
            </p>
          )}

          <div className="text-center mt-6">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-md font-semibold transition cursor-pointer"
            >
              <FiLock />
              تغيير كلمة المرور
            </button>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <PasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
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