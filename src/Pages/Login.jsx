import { useState } from "react";
import { setUserData, fetchWithAuth } from "../utils";

function Login() {
    const [username, setUser] = useState("");
    const [password, setPass] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const data = await fetchWithAuth("/auth/login", {
                method: "POST",
                body: JSON.stringify({ username, password }),
                headers: { "Content-Type": "application/json" },
            });

            if (!data.user) throw new Error("المستخدم غير موجود أو البيانات غير مكتملة");

            setUserData(data.user);
            alert("تم تسجيل الدخول بنجاح");
            window.location.pathname = "/";
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
                <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">تسجيل الدخول</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <form onSubmit={handleLogin} className="space-y-4 text-teal-800 font-bold">
                    <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="اسم المستخدم"
                        value={username}
                        onChange={(e) => setUser(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="كلمة المرور"
                        value={password}
                        onChange={(e) => setPass(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-md transition"
                    >
                        تسجيل الدخول
                    </button>
                </form>

                <p className="mt-4 text-center text-gray-700">
                    لا تملك حساب؟ <a href="/register" className="text-teal-600 hover:underline">سجل الآن</a>
                </p>
            </div>
        </div>
    );
}

export default Login;
