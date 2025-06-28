import { mainPath } from "../utils";
import PropTypes from "prop-types";

function QuizBtn({path, quizName}) {
    return (
        <a href={mainPath + path} className="p-3 bg-gray-100 m-1">
            <span>{quizName}</span>
        </a>
    )
}

QuizBtn.propTypes = {
    path: PropTypes.string,
    quizName: PropTypes.string,
};

export default QuizBtn;