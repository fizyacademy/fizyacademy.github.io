import { useState } from "react";
import PropTypes from "prop-types";

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-center text-teal-700 mb-4">
          تغيير كلمة المرور
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            name="current_password"
            placeholder="كلمة المرور الحالية"
            value={form.current_password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-teal-800"
            required
          />
          <input
            type="password"
            name="new_password"
            placeholder="كلمة المرور الجديدة"
            value={form.new_password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-teal-800"
            required
          />
          <input
            type="password"
            name="confirm_password"
            placeholder="تأكيد كلمة المرور"
            value={form.confirm_password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-teal-800"
            required
          />

          {msg && (
            <p className="text-sm text-center mt-2 text-red-600">{msg}</p>
          )}

          <div className="flex justify-between items-center mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "جاري الحفظ..." : "حفظ التغيير"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-black underline text-sm"
            >
              إغلاق
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
