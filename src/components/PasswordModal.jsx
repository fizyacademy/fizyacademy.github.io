import { useState } from "react";
import PropTypes from "prop-types";
import { FiLock, FiCheck, FiX, FiEye, FiEyeOff } from "react-icons/fi";


const BASE_URL = "http://localhost:5000";

const PasswordModal = ({ onClose }) => {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!form.current_password || !form.new_password || !form.confirm_password) {
      setMsg("❌ جميع الحقول مطلوبة");
      return;
    }

    if (form.new_password.length < 6) {
      setMsg("❌ كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    if (form.new_password !== form.confirm_password) {
      setMsg("❌ كلمتا المرور غير متطابقتين");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/account/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMsg(data.message);

      if (res.ok) {
        setForm({
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
      }
    } catch (err) {
      console.error("خطأ:", err);
      setMsg("❌ حدث خطأ أثناء تغيير كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

const [showPassword, setShowPassword] = useState(false);

  const renderInput = (name, placeholder) => (
    <div>
      <label className="block mb-1 text-sm sm:text-base text-gray-800 dark:text-white">
        كلمة المرور
      </label>

      <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 border border-gray-300 dark:border-gray-600 rounded-md p-3">
        <span className="text-xl text-violet-600 dark:text-violet-400">
          <FiLock />
        </span>
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          value={form[name]}
          onChange={handleChange}
          className="w-full bg-transparent text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none disabled:text-gray-400"
          required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-violet-600 dark:text-violet-400 focus:outline-none cursor-pointer"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl w-full max-w-md p-6 text-gray-900 dark:text-white">
        <h2 className="text-xl font-bold text-center text-violet-700 dark:text-violet-300 mb-4">
          تغيير كلمة المرور
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {renderInput("current_password", "كلمة المرور الحالية")}
          {renderInput("new_password", "كلمة المرور الجديدة")}
          {renderInput("confirm_password", "تأكيد كلمة المرور")}

          {msg && (
            <p className="text-sm text-center mt-2 text-red-600 dark:text-red-400">{msg}</p>
          )}

          <div className="flex justify-between items-center mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`cursor-pointer flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md transition font-semibold ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FiCheck />
              {loading ? "جاري الحفظ..." : "حفظ التغيير"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer flex items-center gap-1 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white underline text-sm"
            >
              <FiX /> إغلاق
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

PasswordModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default PasswordModal;
