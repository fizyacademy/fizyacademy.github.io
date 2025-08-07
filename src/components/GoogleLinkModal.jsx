import { useState } from "react";
import PropTypes from "prop-types";
import { FiX, FiCheck } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { fetchWithAuth } from "../utils";
import { showSuccess, showError } from "../components/Toast";

const GoogleLinkModal = ({ onClose, user, setUser }) => {
  const [loading, setLoading] = useState(false);

  const handleUnlink = async () => {
    setLoading(true);
    try {
      const data = await fetchWithAuth("/auth/unlink-google", {
        method: "POST",
        credentials: "include",
      });
      showSuccess(data.message || "تم إلغاء الربط بنجاح");
      setUser({ ...user, google_id: null });
      onClose();
    } catch (err) {
      console.error(err);
      showError(err.message || "فشل إلغاء الربط");
    } finally {
      setLoading(false);
    }
  };

  const handleLink = () => {
    window.location.href = "http://localhost:5000/auth/google-link";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl w-full max-w-md p-6 text-gray-900 dark:text-white">
        <h2 className="text-xl font-bold text-center text-violet-700 dark:text-violet-300 mb-4">
          {user.google_id ? "إدارة ربط جوجل" : "ربط حساب جوجل"}
        </h2>

        <div className="flex flex-col items-center space-y-4">
          <FcGoogle size={50} />
          <p className="text-center text-gray-600 dark:text-gray-300">
            {user.google_id
              ? "حسابك مربوط بجوجل. يمكنك إلغاء الربط إذا أردت."
              : "يمكنك ربط حسابك بجوجل لتسجيل دخول أسرع."}
          </p>
        </div>

        <div className="flex justify-between items-center mt-6">
          {user.google_id ? (
            <button
              onClick={handleUnlink}
              disabled={loading}
              className={`cursor-pointer flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition font-semibold ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <FiCheck />
              {loading ? "جاري الإلغاء..." : "إلغاء الربط"}
            </button>
          ) : (
            <button
              onClick={handleLink}
              className="cursor-pointer flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition font-semibold"
            >
              <FiCheck /> ربط الحساب
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer flex items-center gap-1 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white underline text-sm"
          >
            <FiX /> إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

GoogleLinkModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  setUser: PropTypes.func.isRequired,
};

export default GoogleLinkModal;
