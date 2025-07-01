import { useState } from "react";
import PropTypes from "prop-types";
import { FiX } from "react-icons/fi";

const avatars = [
  { name: "boy_1", src: "/avatars/boy_1.png" },
  { name: "girl_1", src: "/avatars/girl_1.png" },
  { name: "boy_2", src: "/avatars/boy_2.png" },
  { name: "girl_2", src: "/avatars/girl_2.png" },
  { name: "boy_3", src: "/avatars/boy_3.png" },
  { name: "girl_3", src: "/avatars/girl_3.png" },
  { name: "boy_4", src: "/avatars/boy_4.png" },
  { name: "girl_4", src: "/avatars/girl_4.png" },
  { name: "boy_5", src: "/avatars/boy_5.png" },
  { name: "girl_5", src: "/avatars/girl_5.png" },
];

const AvatarModal = ({ currentAvatar, onSelect, onClose }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (avatarName) => {
    setSelected(avatarName);
    setTimeout(() => {
      onSelect(avatarName);
      onClose();
    }, 400); // ✅ delay بسيط يسمح بالفيد
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl w-full max-w-3xl mx-4 p-6 text-gray-900 dark:text-white transition-all duration-500 ease-in-out">
        <h2 className="text-2xl font-bold text-center text-violet-700 dark:text-violet-300 mb-6">
          اختيار صورة الحساب
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 justify-items-center">
          {avatars.map((avatar) => {
            const isActive = avatar.name === (selected || currentAvatar);

            return (
              <button
                key={avatar.name}
                onClick={() => handleSelect(avatar.name)}
                className="relative rounded-full transition-all duration-300 ease-in-out p-1 group cursor-pointer"
              >
                <img
                  src={avatar.src}
                  alt={avatar.name}
                  className="w-20 h-20 rounded-full object-cover transition-opacity duration-300 ease-in-out"
                />
                <span
                  className={`
                    absolute inset-0 rounded-full
                    transition-all duration-300 ease-in-out pointer-events-none
                    ${isActive
                      ? "ring-4 ring-violet-500 opacity-100"
                      : "ring-4 ring-transparent opacity-0 group-hover:opacity-30"}
                  `}
                />
              </button>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 flex items-center mx-auto dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 underline transition cursor-pointer"
          >
            <FiX/>إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

AvatarModal.propTypes = {
  currentAvatar: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AvatarModal;
