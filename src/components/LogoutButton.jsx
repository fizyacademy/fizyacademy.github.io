import { useNavigate } from "react-router-dom";
import { logout } from "../utils";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Remove JWT
    navigate("/");
  };

  return (
    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
      Logout
    </button>
  );
};

export default LogoutButton;
