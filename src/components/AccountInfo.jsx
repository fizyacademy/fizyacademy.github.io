import PropTypes from "prop-types";
import { arabic_name, userCode } from "../utils";
import { FiUser } from "react-icons/fi";

function AccountInfo({ role, isCollapsed }) {
  return (
    <div
      className={`flex items-center gap-3 ${isCollapsed ? "p-[1px]" : "p-3"}
        transition-all rounded-xl`}
    >
      <div className="bg-violet-600 dark:bg-violet-700 text-white p-2 rounded-full shadow">
        <FiUser className="text-2xl" />
      </div>

      {!isCollapsed && (
        <div className="transition-all">
          <h2 className="text-base font-semibold text-gray-800 dark:text-white">{arabic_name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-gray-500 dark:text-gray-300">{role}</p>
            <p className="text-sm text-gray-500 dark:text-gray-300">{userCode}</p>
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
