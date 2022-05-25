import "../../Common.scss";
import { AnswerItem } from "../../dataTypes/AnswerItem";
import { AnswerMatrixItem } from "../../dataTypes/AnswerMatrixItem";
import { QuestionDataItem } from "../../dataTypes/QuestionDataItem";

interface QuestionProps {
  currentQuestion: QuestionDataItem;
  handleUserSelection: (answerId: number, isChecked: boolean) => void;
  answerMatrix: AnswerMatrixItem[];
}

/** Returns the question that's rendered */
function Question(props: QuestionProps) {
  const { currentQuestion, handleUserSelection, answerMatrix } = props;
  const questionType = currentQuestion.questionType;
  const answers = currentQuestion.answers;

  let answerMatrixItem = answerMatrix.find(
    (am: AnswerMatrixItem) => am.questionId === currentQuestion.questionId
  );

  /**
   * To check whether the answer Id is selected or not.
   * @param answerId
   * @returns
   */
  function isChecked(answerId: number) {
    let isChecked =
      answerMatrixItem?.selectedAnswerIds.find(
        (si: number) => si === answerId
      ) !== undefined;
    return isChecked;
  }

  /**
   * Handle Radio button checked behavior to
   * simulate togglable radio button.
   * @param answerId
   */
  const handleRadioButtonCheckedEvent = (answerId: number) => {
    if (answerMatrixItem) {
      if (answerMatrixItem.selectedAnswerIds.find((sai) => sai === answerId)) {
        handleUserSelection(answerId, false);
      } else {
        handleUserSelection(answerId, true);
      }
    }
  };

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
                checked={isChecked(ans.answerId)}
                onChange={(e) =>
                  questionType === "m"
                    ? handleUserSelection(ans.answerId, e.target.checked)
                    : undefined
                }
                onClick={(e) =>
                  questionType === "s"
                    ? handleRadioButtonCheckedEvent(ans.answerId)
                    : undefined
                }
              />
              {ans.answerText}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Question;
