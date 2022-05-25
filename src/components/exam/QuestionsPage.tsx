import TimerForTest from "./TimerForTest";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import FancyButton from "../common/FancyButton";
import * as dp from "../../DataProvider";
import * as dm from "../../DataManipulation";
import "../../Common.scss";
import React from "react";
import Question from "./Question";
import { AnswerMatrixItem } from "../../dataTypes/AnswerMatrixItem";
import { QuestionDataItem } from "../../dataTypes/QuestionDataItem";
import ButtonPanel from "./ButtonsPanel";
import ExamOverPage from "./ExamOverPage";
import AlertDialog from "../common/AlertDialog";

function QuestionsPage(props: any) {
  const {
    navigateAfterTestEnd,
    selectedLevel,
    examTimeLimit,
    registrationData,
  } = props;

  const questions = dp.getExamData(selectedLevel);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(examTimeLimit);
  const [isExamOver, setIsExamOver] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  setTimeout(() => {
    if (timeLeft === 0) {
      setIsExamOver(true);
    } else {
      setTimeLeft(timeLeft - 1);
    }
  }, 1000);

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
    setIsDialogOpen(true);
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
    setIsDialogOpen(false); // To automatically close dialog when test ends.
    setIsExamOver(true);
    setTimeLeft(0);
  };

  const passThruProps = { currentQuestion, handleUserSelection, answerMatrix };

  let attemptedQuestions = answerMatrix.filter(
    (am) => am.selectedAnswerIds.length > 0
  );
  let attemptedQuestionsCount = attemptedQuestions.length;

  const buttonsPanelProps = {
    handleGoToPreviousQuestion,
    handleGoToNextQuestion,
    currentQuestionIndex,
    totalQuestions,
    handleFinishTest,
  };

  const handleCloseWithResponse = (resp: boolean) => {
    setIsDialogOpen(false);
    if (resp) {
      finishTest();
    }
  };

  const alertDialogPrompt = { isDialogOpen, handleCloseWithResponse };

  /**
   * Test component contains Question components and button panel.
   * This is where question answers are displayed along with the timer.
   */
  const testComponent = (
    <div data-testid="testComponent">
      <AlertDialog {...alertDialogPrompt} />
      <div className="commonFlexPanel">
        <div className="panLeft">
          {registrationData && (
            <h1 className="noPaddingMargin">
              Welcome {registrationData.fName} {registrationData.lName}
            </h1>
          )}
        </div>
        <div className="panRight">
          <TimerForTest timeLeft={timeLeft} />
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
        <ButtonPanel {...buttonsPanelProps} />
      </div>
    </div>
  );

  const examOverProps = {
    attemptedQuestionsCount,
    totalQuestions,
    handleDownloadResult,
    navigateAfterTestEnd,
  };

  return isExamOver ? <ExamOverPage {...examOverProps} /> : testComponent;
}

QuestionsPage.propTypes = {
  navigateAfterTestEnd: PropTypes.func,
  selectedLevel: PropTypes.number,
  examTimeLimit: PropTypes.number,
  registrationData: PropTypes.object,
};

export default QuestionsPage;
