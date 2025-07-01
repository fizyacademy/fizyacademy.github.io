import PropTypes from "prop-types";
import { useState } from "react";

function Post({ title, body, className = "", showToggle, container, children }) {
  return (
    <div
      className={`
        ${className} post 
        rounded-2xl p-4 flex flex-col 
        bg-white/60 dark:bg-gray-800/60 
        backdrop-blur-md shadow-md
        max-h-[500px] overflow-hidden
      `}
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-300 dark:border-gray-700 pb-2 mb-2">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
          {title}
        </h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex flex-col text-gray-600 dark:text-gray-300 overflow-y-auto pr-2 h-full">
        <div className="flex flex-col gap-2">
          {container ? children : body}
        </div>

        {/* Optional Toggle */}
        {showToggle && <PostToggle />}
      </div>
    </div>
  );
}

Post.propTypes = {
  title: PropTypes.string,
  body: PropTypes.node,
  className: PropTypes.string,
  showToggle: PropTypes.bool,
  container: PropTypes.bool,
  children: PropTypes.node,
};

const PostToggle = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <span
      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      className="mt-auto self-end font-semibold text-[11px] text-gray-500 hover:text-violet-400 dark:hover:text-violet-400 cursor-pointer"
    >
      {isSidebarOpen ? "اظهار التفاصيل" : "اخفاء التفاصيل"}
    </span>
  );
};

export default Post;
