import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const SideBtn = ({ icon, text, link, isCollapsed }) => {
    return (
        <Link 
            to={link} 
            className={`flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer transition-all 
                ${isCollapsed ? "flex-col justify-center text-center" : ""}`}
        >
            <span className="material-symbols-outlined">{icon}</span>
            <span className={`transition-all duration-300 ${isCollapsed ? "hidden" : "block"}`}>{text}</span>
        </Link>
    );
};

SideBtn.propTypes = {
    icon: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    isCollapsed: PropTypes.bool.isRequired
};

export default SideBtn;
