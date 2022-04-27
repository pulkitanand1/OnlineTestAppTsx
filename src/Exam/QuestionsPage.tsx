import TimerForTest from "./TimerForTest";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import FancyButton from "../FancyButton";
import * as dp from "../DataProvider";
import * as dm from "../DataManipulation";
import "../Common.scss";
import React from "react";
import Question from "./Question";
import { AnswerMatrixItem } from "../dataTypes/AnswerMatrixItem";
import { QuestionDataItem } from "../dataTypes/QuestionDataItem";

function QuestionsPage(props: any) {
  const allowTimerControl = false; // Use to enable start stop timer button for testing.
  const {
    navigateAfterTestEnd,
    selectedLevel,
    examTimeLimit,
    registrationData,
  } = props;

  const questions = dp.getExamData(selectedLevel);
  const [timeLeft, setTimeLeft] = useState(examTimeLimit);
  const [isTimerStarted, setTimerStarted] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const ref = React.createRef<HTMLAnchorElement>();

  const currentQuestion: QuestionDataItem = questions[currentQuestionIndex];

  let blankAnswersMatrix = questions.map((q) => {
    return {
      level: selectedLevel,
      questionId: q.questionId,
      questionType: q.questionType,
      selectedAnswerIds: [],
    } as AnswerMatrixItem;
  });

  const [answerMatrix, setAnswerMatrix] = useState(blankAnswersMatrix);
  const totalQuestions = questions.length;

  /**
   * This effect is responsible for updading component timer state and finishing the session.
   */
  useEffect(() => {
    let timerID: NodeJS.Timeout;
    if (isTimerStarted) {
      if (timeLeft > 0) {
        timerID = setTimeout(() => {
          setTimeLeft(timeLeft - 1);
          clearTimeout(timerID);
        }, 1000);
      } else {
        finishTest();
      }
    }
    return () => {
      clearInterval(timerID);
    };
  });

  /**
   * Updates the answers Matrix based on user Input.
   * This helps in keeping the Question Component controlled
   * as the checked property is maintained on the basis of these entries.
   * @param questionId - Question Id for which response has been recorded
   * @param answerId - Selected Response(s)
   * @param isChecked - true will add it to selectedResponses, false will remove it
   */
  function updateAnswersMatrix(
    questionId: number,
    answerId: number,
    isChecked: boolean
  ) {
    let answerItem = answerMatrix.find(
      (am: AnswerMatrixItem) => am.questionId === questionId
    );
    if (answerItem) {
      if (answerItem.questionType === "s") {
        answerItem.selectedAnswerIds = [answerId];
      } else if (answerItem.questionType === "m") {
        if (isChecked === false) {
          answerItem.selectedAnswerIds = answerItem.selectedAnswerIds.filter(
            (sid) => sid !== answerId
          );
        } else {
          if (
            answerItem.selectedAnswerIds.find((sid) => sid === answerId) ===
            undefined
          ) {
            answerItem.selectedAnswerIds = [
              ...answerItem.selectedAnswerIds,
              answerId,
            ];
          }
        }
      }
      setAnswerMatrix(answerMatrix);
    }
  }

  const handleStartCountDown = () => {
    setTimeLeft(timeLeft);
    setTimerStarted(true);
  };
  const handleStopCountDown = () => {
    setTimeLeft(0);
    setTimerStarted(false);
  };

  /**
   * Handles User selection from checkboxes and radio buttons. Acts like a wrapper.
   * @param e 
   * @param answerId 
   */
  const handleUserSelection = (e: any, answerId: number) => {
    updateAnswersMatrix(currentQuestion.questionId, answerId, e.target.checked);
  };

  /**
   * Handles Previous Question button click.
   */
  const handleGoToPreviousQuestion = () => {
    if (currentQuestionIndex !== 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  /**
   * Handles Next Question button click.
   */
  const handleGoToNextQuestion = () => {
    if (currentQuestionIndex !== questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  /**
   * Handles Submit button click.
   */
  const handleFinishTest = () => {
    let executeResult = window.confirm(
      "Are you sure you want to submit this test?"
    );
    if (executeResult) {
      finishTest();
    }
  };

  /**
   * Handles Download button click.
   */
  const handleDownloadResult = () => {
    const url = dm.finishAndEvaluateTest(
      answerMatrix,
      questions,
      registrationData
    );
    const hiddenDownloadButton = ref.current;
    if (hiddenDownloadButton) {
      hiddenDownloadButton.href = url;
      hiddenDownloadButton.click();
    }
  };

  /**
   * Performs neccessary state changes to end test session in both auto and manual submission.
   */
  const finishTest = () => {
    setTimerStarted(true);
    setTimeLeft(0);
  };

  const passThruProps = { currentQuestion, handleUserSelection, answerMatrix };

  /**
   * Button panel that comprises of "Previous Question", "Next Question" and "Submit" buttons.
   */
  const buttonPanel = (
    <div className="questionNavButtonPanel">
      <div className="panLeft">
        <FancyButton
          buttonText="Previous Question"
          onClick={handleGoToPreviousQuestion}
          isDisabled={currentQuestionIndex === 0}
        />
        <FancyButton
          buttonText="Next Question"
          onClick={handleGoToNextQuestion}
          isDisabled={currentQuestionIndex === totalQuestions - 1}
        />
      </div>
      <div className="panRight">
        <FancyButton buttonText="Submit" onClick={handleFinishTest} />
      </div>
    </div>
  );

  let attemptedQuestions = answerMatrix.filter(
    (am) => am.selectedAnswerIds.length > 0
  );
  let attemptedQuestionsCount = attemptedQuestions.length;

  /**
   * Test component contains Question components and button panel. 
   * This is where question answers are displayed along with the timer.
   */
  const testComponent = (
    <div data-testid="testComponent">
      <div className="commonFlexPanel">
        <div className="panLeft">
          <h1 className="noPaddingMargin">
            Welcome {registrationData.fName}, {registrationData.lName}
          </h1>
        </div>
        <div className="panRight">
          <TimerForTest
            stopCountDown={handleStopCountDown}
            timeLeft={timeLeft}
          />
        </div>
      </div>

      <div className="questionStatusPanel">
        <h2 className="leftHeading">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </h2>
        <h2 className="rightHeading">
          Attempted questions : {attemptedQuestionsCount}
        </h2>
      </div>
      <div>
        <Question {...passThruProps} />
        {buttonPanel}
      </div>
      {allowTimerControl && (
        <div className="commonFlexPanel">
          <FancyButton
            buttonText="Start Timer"
            onClick={handleStartCountDown}
          />
          <FancyButton buttonText="Stop Timer" onClick={handleStopCountDown} />
        </div>
      )}
    </div>
  );

  /**
   * This is displayed when the test ends either after timeout or manual submission.
   * It shows the "Download Result" button and "Exit" button.
   */
  const examOver = (
    <div className="center" data-testid="examOver">
      <div>
        <h1>Exam is over!</h1>
        <h2>
          Questions attempted: {attemptedQuestionsCount} out of{" "}
          {questions.length}
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

  return isTimerStarted && timeLeft === 0 ? examOver : testComponent;
}

QuestionsPage.propTypes = {
  navigateAfterTestEnd: PropTypes.func,
  selectedLevel: PropTypes.number,
  examTimeLimit: PropTypes.number,
  registrationData: PropTypes.object,
};

export default QuestionsPage;
