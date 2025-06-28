import { mainPath, role, logout } from '../utils';

function Navbar() {
    const isAuthenticated = role; // Check if user is logged in

    const handleLogout = () => {
        logout(); // Remove JWT
        window.location.href = mainPath; // Redirect to home
    };

    return (
        <div id="header" className="fixed left-0 top-0 bg-gray-50 text-black font-semibold flex h-[8vh] px-8 justify-between w-full items-center shadow-xl z-2">
            <a href={mainPath}>
                <h1 className="font-bold cursor-pointer text-[20px] text-cyan-900">
                    Fizyacademy<span className="text-xs text-[14px] text-amber-600">.com</span>
                </h1>
            </a>

            {role === "student" && (
                <nav className="navbar flex justify-evenly w-full font-bold text-[15px] mx-18">
                    <a href={mainPath} className="hover:text-cyan-900">الصفحة الرئيسية</a>
                    <a href={`${mainPath}sessions`} className="hover:text-cyan-900">المحاضرات</a>
                    <a href={`${mainPath}pricing`} className="hover:text-cyan-900">الأسعار</a>
                    <a href={`${mainPath}contact`} className="hover:text-cyan-900">تواصل معنا</a>
                </nav>
            )}

            {/* Authentication Buttons */}
            <div className="flex gap-4">
                {isAuthenticated == 'guest' ? (
                    <a href={`${mainPath}login`} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                        تسجيل الدخول
                    </a>
                ) : (
                    <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">
                        تسجيل الخروج
                    </button>
                )}
            </div>
        </div>
    );
}

export default Navbar;
