import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Icon } from '@iconify/react';

const iconMap = {
  home: 'mdi:home',
  manage_accounts: 'mdi:account-cog',
  group: 'mdi:account-group',
  quiz: 'mdi:clipboard-text',
  assignment: 'mdi:clipboard-check',
  video_library: 'mdi:video-outline',
  task: 'mdi:chart-line',
  payments: 'mdi:credit-card-outline'
};

const SideBtn = ({ icon, text, link, isCollapsed }) => {
  return (
    <Link
      to={link}
      className={`flex items-center gap-3 p-3 rounded-xl transition-all text-gray-900 dark:text-white hover:text-violet-500 ${
        isCollapsed ? "justify-center" : ""
      }`}
    >
      <Icon icon={iconMap[icon] || 'mdi:circle'} className="text-2xl" />
      {!isCollapsed && <span className="text-xl font-normal">{text}</span>}
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
