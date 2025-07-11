// components/toast.js
import toast from "react-hot-toast";

/**
 * ✅ عرض رسالة نجاح بسيطة
 * @param {string} message - الرسالة التي ستظهر
 */
export const showSuccess = (message) => {
    toast.success(message, {
        duration: 3000,
        style: {
        padding: '10px 16px',
        },
        iconTheme: {
        primary: '#22c55e',
        secondary: '#f0fdf4',
        },
    });
};

/**
 * ❌ عرض رسالة خطأ بسيطة
 * @param {string} message - الرسالة التي ستظهر
 */
export const showError = (message) => {
    toast.error(message, {
        duration: 4000,
        style: {
        padding: '10px 16px',
        },
        iconTheme: {
        primary: '#ef4444',
        secondary: '#fef2f2',
        },
    });
};

/**
 * ⚠️ عرض رسالة تحذير أو معلومات
 * @param {string} message - الرسالة التي ستظهر
 */
export const showInfo = (message) => {
    toast(message, {
        icon: "⚠️",
        duration: 4000,
        style: {
        padding: '10px 16px',
        },
    });
};


/**
 * 🧩 عرض توست مخصص بـ JSX أو Component
 * @param {JSX.Element | string} content - المحتوى المعروض
 */
export const showCustom = (content) => {
    toast(content, {
        duration: 4000,
    });
};

/**
 * 🔁 توست مع Promise (مثلاً: تسجيل الدخول، حفظ، حذف...)
 * @param {Promise} promiseFn - الدالة التي ترجع Promise
 * @param {Object} msgs - رسائل التوست: { loading, success, error }
 * @returns {Promise}
 */
export const showPromise = (promiseFn, msgs = {}) => {
    return toast.promise(
        promiseFn,
        {
        loading: msgs.loading || "جارٍ التنفيذ...",
        success: msgs.success || "تم بنجاح",
        error: msgs.error || "حدث خطأ ما",
        },
        {
        success: { duration: 3000 },
        error: { duration: 4000 },
        }
    );
};
