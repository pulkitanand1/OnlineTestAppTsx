import { useState } from "react";
import "./QuestionsNavigationPanel.scss";

interface QuestionsNavigationPanelProps {
  currentQuestion: number;
  totalQuestions: number;
  attemptedQArray: number[];
  handleQuestionNavigation: (idx: number) => void;
}

/**
 * It consists of an array of button which upon click
 * will bring the user to nth question.
 * @param props
 * @returns
 */
const QuestionsNavigationPanel = (props: QuestionsNavigationPanelProps) => {
  const {
    currentQuestion,
    totalQuestions,
    attemptedQArray,
    handleQuestionNavigation,
  } = props;
  const [indexArray] = useState(
    Array.from({ length: totalQuestions }, (_, i) => i + 1)
  ); // To avoid recalculations upon render

  return (
    <div className="questionsNavPanel">
      {indexArray.map((i) => {
        let isAttempted = attemptedQArray?.find((aqi) => aqi === i);
        if (currentQuestion === i) {
          return (
            <button
              key={i}
              className={
                isAttempted ? "qnav current attempted" : "qnav current"
              }
              onClick={() => handleQuestionNavigation(i - 1)}
            >
              {i}
            </button>
          );
        } else {
          return (
            <button
              key={i}
              className={isAttempted ? "qnav attempted" : "qnav"}
              onClick={() => handleQuestionNavigation(i - 1)}
            >
              {i}
            </button>
          );
        }
      })}
    </div>
  );
};

export default QuestionsNavigationPanel;
