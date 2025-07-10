import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // أيقونة احترافية
import PropTypes from "prop-types";
import { mainPath } from "../utils"

const BackButton = ({ className = "" }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate(mainPath); // صفحة افتراضية
        }
    };


    return (
        <button
            onClick={handleBack}
            className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 shadow transition ${className}`}
            >
            <ArrowLeft size={20} />
            رجوع
            </button>
        );
};

BackButton.propTypes = {
    className: PropTypes.string
};

export default BackButton;