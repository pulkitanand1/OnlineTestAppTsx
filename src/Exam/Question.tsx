import PropTypes from "prop-types";
import "../Common.scss";
import { AnswerItem } from "../dataTypes/AnswerItem";
import { AnswerMatrixItem } from "../dataTypes/AnswerMatrixItem";

/** Returns the question that's rendered */
function Question(props: any) {
  const { currentQuestion, handleUserSelection, answerMatrix } = props;
  const questionType = currentQuestion.questionType;
  const answers = currentQuestion.answers;

  let answerMatrixItem = answerMatrix.find(
    (am: AnswerMatrixItem) => am.questionId === currentQuestion.questionId
  );

  function isChecked(answerId: number) {
    let isChecked =
      answerMatrixItem.selectedAnswerIds.find(
        (si: number) => si === answerId
      ) !== undefined;
    return isChecked;
  }

  return (
    <div className="questionPanel">
      <h1 className="question">{currentQuestion.questionText}</h1>
      {answers.map((ans: AnswerItem) => (
        <div
          key={
            currentQuestion.level +
            "-" +
            currentQuestion.questionId +
            "-" +
            ans.answerId
          }
        >
          <div className="answerItem">
            <h2>
              <input
                className="inputControl"
                name={currentQuestion.level + "-" + currentQuestion.questionId}
                type={questionType === "m" ? "checkbox" : "radio"}
                defaultChecked={isChecked(ans.answerId)}
                onChange={(e) => handleUserSelection(e, ans.answerId)}
              />
              {ans.answerText}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
}
Question.propTypes = {
  currentQuestion: PropTypes.object,
  handleUserSelection: PropTypes.func,
  answerMatrix: PropTypes.array,
};

export default Question;
