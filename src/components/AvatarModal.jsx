import PropTypes from "prop-types";

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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl mx-4 p-6">
        <h2 className="text-2xl font-bold text-center text-teal-700 mb-6">اختيار صورة الحساب</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 justify-items-center">
          {avatars.map((avatar) => (
            <button
              key={avatar.name}
              onClick={() => onSelect(avatar.name)}
              className={`rounded-full border-4 p-1 transition ${
                avatar.name === currentAvatar
                  ? "border-teal-500"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <img
                src={avatar.src}
                alt={avatar.name}
                className="w-20 h-20 rounded-full object-cover"
              />
            </button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-teal-600 underline transition"
          >
            إغلاق
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
