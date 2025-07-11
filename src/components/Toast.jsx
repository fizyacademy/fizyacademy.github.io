import toast from "react-hot-toast";

/**
 *  دالة ترجع style حسب المود (فاتح أو داكن)
 *  تعتمد على `document.documentElement.classList` التي بها `dark`
 */
const getToastStyle = () => {
    const isDark = document.documentElement.classList.contains("dark");
    return {
        padding: "10px 16px",
        background: isDark ? "#1f2937" : "#fff", // gray-800 أو white
        color: isDark ? "#f3f4f6" : "#111827",   // gray-100 أو gray-900
        border: isDark ? "1px solid #374151" : "1px solid #e5e7eb", // gray-700 or gray-200
    };
};

/**
 *  ✅ عرض رسالة نجاح بسيطة
 *  @param {string} message - الرسالة التي ستظهر
 */
export const showSuccess = (message) => {
    toast.success(message, {
        duration: 3000,
        style: getToastStyle(),
        iconTheme: {
        primary: "#22c55e",   // green-500
        secondary: "#f0fdf4", // green-50
        },
    });
};

/**
 *  ❌ عرض رسالة خطأ بسيطة
 *  @param {string} message - الرسالة التي ستظهر
 */
export const showError = (message) => {
    toast.error(message, {
        duration: 4000,
        style: getToastStyle(),
        iconTheme: {
        primary: "#ef4444",   // red-500
        secondary: "#fef2f2", // red-50
        },
    });
};

/**
 *  ⚠️ عرض رسالة تحذير أو معلومات
 *  @param {string} message - الرسالة التي ستظهر
 */
export const showInfo = (message) => {
    toast(message, {
        icon: "⚠️",
        duration: 4000,
        style: getToastStyle(),
    });
};

/**
 *  🧩 عرض توست مخصص بـ JSX أو Component
 *  @param {JSX.Element | string} content - المحتوى المعروض
 */ 
export const showCustom = (content) => {
    toast(content, {
        duration: 4000,
        style: getToastStyle(),
    });
};

/**
 *  🔁 توست مع Promise (مثلاً: تسجيل الدخول، حفظ، حذف...)
 *  @param {Promise} promiseFn - الدالة التي ترجع Promise
 *  @param {Object} msgs - رسائل التوست: { loading, success, error }
 *  @returns {Promise}
 */
export const showPromise = (promiseFn, msgs = {}) => {
    return toast.promise(
        promiseFn,
        {
        loading: msgs.loading || "جارٍ التنفيذ...",
        success: msgs.success || "تم بنجاح",
        error:
            typeof msgs.error === "function"
            ? msgs.error
            : msgs.error || "حدث خطأ ما",
        },
        {
        success: { duration: 3000, style: getToastStyle() },
        error: { duration: 4000, style: getToastStyle() },
        loading: { style: getToastStyle() },
        }
    );
};
