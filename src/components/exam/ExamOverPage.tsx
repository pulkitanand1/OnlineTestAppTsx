import React from "react";
import FancyButton from "../common/FancyButton";
import * as dm from "../../features/dataManipulation/DataManipulation";
import WelcomeUser from "./WelcomUser";
import { AnswerMatrixItem } from "../../dataTypes/AnswerMatrixItem";
import { useSelector } from "react-redux";
import { selectLevelWiseQuestionsData } from "../../features/exam/levelWiseQuestionsSlice";

/**
 * This is displayed when the test ends either after timeout or manual submission.
 * It shows the "Download Result" button and "Exit" button.
 */

interface ExamOverPageProps {
  answerMatrix: AnswerMatrixItem[];
  registrationData: any;
  navigateAfterTestEnd: () => void;
  handleLogOut: () => void;
}

const ExamOverPage = (props: ExamOverPageProps) => {
  const { navigateAfterTestEnd, registrationData, handleLogOut } = props;

  const answerMatrix = JSON.parse(
    localStorage.getItem("answerMatrix") as string
  ) as AnswerMatrixItem[];

  const questions = useSelector(selectLevelWiseQuestionsData);
  const evaulationData = dm.finishAndEvaluateTest(answerMatrix, questions);
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

  const welcomeUserProps = { registrationData, handleLogOut };
  return (
    <div className="center" data-testid="examOver">
      <WelcomeUser {...welcomeUserProps} />
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
      <div className="centerButtonPanel">
        <div className="commonFlexPanel">
          <FancyButton
            buttonText="Download Result"
            onClickAction={handleDownloadResult}
          />
          <a ref={ref} download="testResults.json" hidden={true}></a>
          <FancyButton buttonText="Home" onClickAction={navigateAfterTestEnd} />
        </div>
      </div>
    </div>
  );
};
export default ExamOverPage;
