import PropTypes from "prop-types";
import { useState } from "react";


function Post({ title, body, className, showToggle, container, children }) {
    return (
        <div className={`post ${className} bg-white rounded-2xl p-4 flex flex-col overflow-x-hidden`}>
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-2 mb-2 overflow-y-hidden">
                <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
            </div>

            {/* Content */}
            <div className="flex flex-col h-full text-gray-500 mr-4 overflow-x-hidden overflow-y-auto">
                <div className="flex flex-col h-full overflow-x-hidden">
                    {container == true ? children : body}
                </div>
                {showToggle === true? <PostToggle /> : ""}
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
        <span className="mt-auto self-end font-semibold text-[11px] hover:text-blue-700 cursor-pointer" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>{isSidebarOpen ? "اظهار التفاصيل" : "اخفاء التفاصيل"}</span>
    );
};

export default Post;
