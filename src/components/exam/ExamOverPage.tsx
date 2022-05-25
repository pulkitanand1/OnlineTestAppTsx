import React from "react";
import { EvaluationItem } from "../../DataManipulation";
import FancyButton from "../common/FancyButton";
import * as dm from "../../DataManipulation";

/**
 * This is displayed when the test ends either after timeout or manual submission.
 * It shows the "Download Result" button and "Exit" button.
 */

interface ExamOverPageProps {
  evaulationData: EvaluationItem[];
  registrationData: any;
  navigateAfterTestEnd: () => void;
}

const ExamOverPage = (props: ExamOverPageProps) => {
  const { evaulationData, navigateAfterTestEnd, registrationData } = props;
  const totalQuestions = evaulationData.length;
  const attemptedQuestions = evaulationData.filter(
    (ed) => ed.userAnswers?.length > 0
  );
  const attemptedQuestionsCount = attemptedQuestions.length;
  const correctAnswersCount = attemptedQuestions.filter(
    (aq) => aq.answeredCorrectly
  )?.length;

  const ref = React.createRef<HTMLAnchorElement>();

  /**
   * Handles Download button click.
   */
  const handleDownloadResult = () => {
    const url = dm.generateJSONDownloadUrl(registrationData, evaulationData);
    const hiddenDownloadButton = ref.current;
    if (hiddenDownloadButton) {
      hiddenDownloadButton.href = url;
      hiddenDownloadButton.click();
    }
  };
  return (
    <div className="center" data-testid="examOver">
      <div>
        <h1>Exam is over!</h1>
        <h2>
          Questions attempted: {attemptedQuestionsCount} out of {totalQuestions}
        </h2>
        {attemptedQuestionsCount > 0 && (
          <div>
            <h2>Correct Answers: {correctAnswersCount}</h2>
            <h2>
              Wrong Answers: {attemptedQuestionsCount - correctAnswersCount}
            </h2>
          </div>
        )}

        <h2>Please download the result below!</h2>
      </div>
      <div className="commonFlexPanel">
        <FancyButton
          buttonText="Download Result"
          onClick={handleDownloadResult}
        />
        <FancyButton buttonText="Exit" onClick={navigateAfterTestEnd} />
        <a ref={ref} download="testResults.json" hidden={true}></a>
      </div>
    </div>
  );
};
export default ExamOverPage;
