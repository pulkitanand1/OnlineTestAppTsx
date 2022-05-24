import React, { ForwardedRef } from "react";
import FancyButton from "../common/FancyButton";

/**
 * This is displayed when the test ends either after timeout or manual submission.
 * It shows the "Download Result" button and "Exit" button.
 */

interface ExamOverPageProps {
  attemptedQuestionsCount: number;
  totalQuestions: number;
  handleDownloadResult: () => void;
  navigateAfterTestEnd: () => void;
}

const ExamOverPage = React.forwardRef(
  (props: ExamOverPageProps, ref: ForwardedRef<HTMLAnchorElement>) => {
    const {
      attemptedQuestionsCount,
      totalQuestions,
      handleDownloadResult,
      navigateAfterTestEnd,
    } = props;

    return (
      <div className="center" data-testid="examOver">
        <div>
          <h1>Exam is over!</h1>
          <h2>
            Questions attempted: {attemptedQuestionsCount} out of{" "}
            {totalQuestions}
          </h2>
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
  }
);

ExamOverPage.displayName = "ExamOverPage";

export default ExamOverPage;
