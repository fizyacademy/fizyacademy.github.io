import { FiLogOut } from 'react-icons/fi';
import { mainPath, role, logout } from '../utils';
import ThemeToggle from './ThemeToggle';

function Navbar() {
  const isAuthenticated = role; // Check if user is logged in

  const handleLogout = () => {
    logout(); // Remove JWT
    window.location.href = mainPath; // Redirect to home
  };

  return (
    <header className="fixed top-0 left-0 w-full h-[8vh] bg-white/70 dark:bg-gray-800 backdrop-blur z-50 shadow-md border-b border-gray-200 dark:border-gray-700 px-4 md:px-8 flex items-center justify-between text-gray-900 dark:text-white">
      {/* Logo */}
      <a href={mainPath} className="text-xl md:text-2xl font-bold text-violet-700 dark:text-violet-300">
        Fizyacademy<span className="text-xs text-amber-500">.com</span>
      </a>

      {/* Navigation (for students only) */}
      {role === "student" && (
        <nav className="hidden md:flex gap-6 font-medium text-sm">
          <a href={mainPath} className="hover:text-violet-700 dark:hover:text-violet-400">الصفحة الرئيسية</a>
          <a href={`${mainPath}sessions`} className="hover:text-violet-700 dark:hover:text-violet-400">المحاضرات</a>
          <a href={`${mainPath}pricing`} className="hover:text-violet-700 dark:hover:text-violet-400">الأسعار</a>
          <a href={`${mainPath}contact`} className="hover:text-violet-700 dark:hover:text-violet-400">تواصل معنا</a>
        </nav>
      )}

      {/* Theme & Auth */}
      <div className="flex items-center gap-3 md:gap-4">
        <ThemeToggle />
        {isAuthenticated === "guest" ? (
          <a
            href={`${mainPath}login`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm md:text-base transition"
          >
            تسجيل الدخول
          </a>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm md:text-base transition cursor-pointer"
          >
            <div className='flex items-center gap-2'>
                تسجيل الخروج
                <FiLogOut/>
            </div>
          </button>
        )}
      </div>
    </header>
  );
}

export default Navbar;
