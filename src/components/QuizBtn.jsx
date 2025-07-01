import { mainPath } from "../utils";
import PropTypes from "prop-types";

function QuizBtn({ path, quizName }) {
  return (
    <a
      href={mainPath + path}
      className="p-3 m-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
    >
      <span className="text-sm font-medium">{quizName}</span>
    </a>
  );
}

QuizBtn.propTypes = {
  path: PropTypes.string,
  quizName: PropTypes.string,
};

export default QuizBtn;
