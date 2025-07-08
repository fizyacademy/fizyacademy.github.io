import PropTypes from "prop-types";
import { useAuth } from "../AuthContext"; // ✅

const avatarImages = {
  boy_1: "/avatars/boy_1.png",
  girl_1: "/avatars/girl_1.png",
  boy_2: "/avatars/boy_2.png",
  girl_2: "/avatars/girl_2.png",
  boy_3: "/avatars/boy_3.png",
  girl_3: "/avatars/girl_3.png",
  boy_4: "/avatars/boy_4.png",
  girl_4: "/avatars/girl_4.png",
  boy_5: "/avatars/boy_5.png",
  girl_5: "/avatars/girl_5.png",
};

function AccountInfo({ role: customRole, isCollapsed }) {
  const { user } = useAuth(); // ✅ استخدام AuthContext

  const role = customRole || user?.role;
  const name = user?.arabic_name;
  const code = user?.user_code;
  const avatarSrc = user?.avatar ? avatarImages[user.avatar] : null;

  return (
    <div className={`flex items-center gap-3 ${isCollapsed ? "p-[1px]" : "p-3"} transition-all rounded-xl`}>
      <div className="bg-violet-600 dark:bg-violet-700 text-white p-1 rounded-full shadow">
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-white"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-white opacity-50" />
        )}
      </div>

      {!isCollapsed && user && (
        <div className="transition-all">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white">{name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-gray-500 dark:text-gray-300">{role}</p>
            <p className="text-sm text-gray-500 dark:text-gray-300">{code}</p>
          </div>
        </div>
      )}
    </div>
  );
}

AccountInfo.propTypes = {
  role: PropTypes.string,
  isCollapsed: PropTypes.bool,
};

export default AccountInfo;
