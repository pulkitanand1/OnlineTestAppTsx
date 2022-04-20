import TimerForTest from "./TimerForTest";
import { HTMLInputTypeAttribute, useEffect, useState } from "react";
import PropTypes from "prop-types";
import FancyButton from "../FancyButton";
import * as dp from "../DataProvider";
import * as dm from "../DataManipulation";
import "../Common.scss";
import React from "react";
import Question from "./QuestionItem";
import { AnswerMatrixItem } from "../dataTypes/AnswerMatrixItem";
import { QuestionDataItem } from "../dataTypes/QuestionDataItem";

function QuestionsPage(props: any) {
  let allowTimerControl = false; // Use to enable start stop timer button for testing.
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

  const handleUserSelection = (e: any, answerId: number) => {
    updateAnswersMatrix(currentQuestion.questionId, answerId, e.target.checked);
  };

  const handleGoToPreviousQuestion = () => {
    if (currentQuestionIndex !== 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleGoToNextQuestion = () => {
    if (currentQuestionIndex !== questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleFinishTest = () => {
    let executeResult = window.confirm(
      "Are you sure you want to submit this test?"
    );
    if (executeResult) {
      finishTest();
    }
  };

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

  const finishTest = () => {
    setTimerStarted(true);
    setTimeLeft(0);
  };

  const passThruProps = { currentQuestion, handleUserSelection, answerMatrix };

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

  const testComponent = (
    <div>
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

  const examOver = (
    <div className="center">
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
