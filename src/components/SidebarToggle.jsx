import PropTypes from "prop-types";

const SidebarToggle = ({ isCollapsed, setIsCollapsed }) => {
    return (
        <span 
            className="bg-gray-900 hover:bg-gray-800 material-symbols-outlined cursor-pointer text-white rounded-full shadow-2xl fixed top-[12vh] transition-all duration-300 p-2"
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{ right: isCollapsed ? "5vw" : "18vw" }}
        >
            {isCollapsed ? "chevron_left" : "chevron_right"}
        </span>
    );
};

SidebarToggle.propTypes = {
    isCollapsed: PropTypes.bool.isRequired,
    setIsCollapsed: PropTypes.func.isRequired,
};

export default SidebarToggle;
