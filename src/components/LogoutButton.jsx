import { useNavigate } from "react-router-dom";
import { logout } from "../utils";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // حذف JWT و user
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
    >
      تسجيل الخروج
    </button>
  );
};

export default LogoutButton;
