import PropTypes from "prop-types";
import { username } from "../utils";

function AccountInfo({ role, isCollapsed }) {
    return (
        <div className="flex flex-row items-center gap-3 p-3">
            <span className="material-symbols-outlined text-white text-4xl">account_circle</span>
            <div className={`transition-all duration-300 ${isCollapsed ? "hidden" : "block"}`}>
                <h2 className="text-lg font-semibold">{username}</h2>
                <p className="text-sm text-gray-400">{role}</p>
            </div>
        </div>
    );
}

AccountInfo.propTypes = {
    role: PropTypes.string,
    isCollapsed: PropTypes.bool,
};

export default AccountInfo;
