import PropTypes from "prop-types";
import { arabic_name, userCode } from "../utils";
import { FiUser } from "react-icons/fi";

function AccountInfo({ role, isCollapsed }) {
  return (
    <div className={`flex items-center gap-3 ${isCollapsed ? "p-[1px]" : "p-3"} transition-all`}>
      <div className="bg-violet-600 text-white p-2 rounded-full shadow-md dark:hover:bg-violet-700">
        <FiUser className="text-2xl" />
      </div>
      {!isCollapsed && (
        <div className="transition-all">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white dark:hover:text-violet-500">{arabic_name}</h2>
          <div className="flex items-center gap-2 ">
            <p className="text-sm text-gray-500 dark:text-gray-400 dark:hover:text-violet-500">{role}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 dark:hover:text-violet-500">{userCode}</p>
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
