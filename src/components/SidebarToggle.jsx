import PropTypes from "prop-types";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const SidebarToggle = ({ isCollapsed, setIsCollapsed }) => {
  return (
    <button
      className={`absolute top-4 -end-4 z-50 
        bg-white/70 dark:bg-gray-800/70 backdrop-blur border border-gray-300 dark:border-gray-600 
        text-violet-700 dark:text-violet-300 rounded-full p-2 shadow-lg transition-all cursor-pointer`}
      onClick={() => setIsCollapsed(!isCollapsed)}
    >
      {isCollapsed ? (
        <FiChevronLeft className="text-xl" />
      ) : (
        <FiChevronRight className="text-xl" />
      )}
    </button>
  );
};

SidebarToggle.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  setIsCollapsed: PropTypes.func.isRequired,
};

export default SidebarToggle;
