import TimerForTest from "./TimerForTest";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "../../Common.scss";
import Question from "./Question";
import { AnswerMatrixItem } from "../../dataTypes/AnswerMatrixItem";
import { QuestionDataItem } from "../../dataTypes/QuestionDataItem";
import ButtonPanel from "./ButtonsPanel";
import ExamOverPage from "./ExamOverPage";
import AlertDialog from "../common/AlertDialog";
import QuestionsNavigationPanel from "./QuestionsNavigationPanel";
import { useAppDispatch } from "../../app/hooks";
import { useSelector } from "react-redux";
import { selectLevelWiseQuestionsData } from "../../features/exam/levelWiseQuestionsSlice";
import { updateLevelWiseQuestionData } from "../../features/exam/examDataProvider";
import RegistrationData from "../../dataTypes/RegistrationData";
import WelcomeUser from "./WelcomUser";

interface QuestionsPageProps {
  navigateAfterTestEnd: () => void;
  selectedLevel: number;
  examTimeLimit: number;
  registrationData: RegistrationData;
  handleLogOut: () => void;
}

function QuestionsPage(props: QuestionsPageProps) {
  const {
    navigateAfterTestEnd,
    selectedLevel,
    examTimeLimit,
    registrationData,
    handleLogOut,
  } = props;
  const questions = useSelector(selectLevelWiseQuestionsData);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (timeLeft === 0){
      finishTest();
    }
    updateLevelWiseQuestionData(dispatch, selectedLevel);
    setCurrentQuestionIndex(0);
  }, []);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(examTimeLimit);
  const [isExamOver, setIsExamOver] = useState(
    localStorage.getItem("otaTestEndTime") === null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  setTimeout(() => {
    if (timeLeft === 0) {
      finishTest();
    } else {
      setTimeLeft(timeLeft - 1);
    }
  }, 1000);

  const currentQuestion: QuestionDataItem = questions[currentQuestionIndex];

  const totalQuestions = questions.length;
  const [answerMatrix, setAnswerMatrix] = useState([] as AnswerMatrixItem[]);

  useEffect(() => {
    if (totalQuestions > 0) {
      let amJson = JSON.parse(localStorage.getItem("answerMatrix") as string);
      if (amJson === null) {
        let newAnswerMatrix = questions.map((q, i) => {
          return {
            index: i,
            level: selectedLevel,
            questionId: q.questionId,
            questionType: q.questionType,
            selectedAnswerIds: [],
          } as AnswerMatrixItem;
        });
        localStorage.setItem("answerMatrix", JSON.stringify(newAnswerMatrix));
        setAnswerMatrix(newAnswerMatrix);
      } else {
        setAnswerMatrix(amJson);
      }
    } else {
      setAnswerMatrix([] as AnswerMatrixItem[]);
    }
  }, [totalQuestions]);

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
    let answerMatrixItem = answerMatrix.find(
      (am: AnswerMatrixItem) => am.questionId === questionId
    );
    if (answerMatrixItem) {
      if (answerMatrixItem.questionType === "s") {
        if (isChecked) {
          answerMatrixItem.selectedAnswerIds = [answerId];
        } else {
          answerMatrixItem.selectedAnswerIds = [];
        }
      } else if (answerMatrixItem.questionType === "m") {
        if (isChecked === false) {
          answerMatrixItem.selectedAnswerIds =
            answerMatrixItem.selectedAnswerIds.filter(
              (sid) => sid !== answerId
            );
        } else {
          if (
            answerMatrixItem.selectedAnswerIds.find(
              (sid) => sid === answerId
            ) === undefined
          ) {
            answerMatrixItem.selectedAnswerIds = [
              ...answerMatrixItem.selectedAnswerIds,
              answerId,
            ];
          }
        }
      }
      localStorage.setItem("answerMatrix", JSON.stringify(answerMatrix));
      setAnswerMatrix([...answerMatrix]);
    }
  }

  /**
   * Handles User selection from checkboxes and radio buttons. Acts like a wrapper.
   * @param e
   * @param answerId
   */
  const handleUserSelection = (answerId: number, isChecked: boolean) => {
    updateAnswersMatrix(currentQuestion.questionId, answerId, isChecked);
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
   * Performs neccessary state changes to end test session in both auto and manual submission.
   */
  const finishTest = () => {
    localStorage.removeItem("otaTestEndTime");
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

  const alertDialogPromptProps = {
    isDialogOpen,
    title: "Submit",
    dialogContent: "Do you want to end the test and submit?",
    handleCloseWithResponse,
  };

  const questionsNavPanelProps = {
    currentQuestion: currentQuestionIndex + 1,
    totalQuestions: totalQuestions,
    attemptedQArray: answerMatrix
      .filter((ai) => ai.selectedAnswerIds?.length > 0)
      .map((v) => v.index + 1),
    handleQuestionNavigation: (idx: number) => setCurrentQuestionIndex(idx),
  };

  const welcomeUserProps = { registrationData, handleLogOut };

  /**
   * Test component contains Question components and button panel.
   * This is where question answers are displayed along with the timer.
   */
  const testComponent = (
    <div data-testid="testComponent">
      <WelcomeUser {...welcomeUserProps} />
      <AlertDialog {...alertDialogPromptProps} />
      <div className="commonFlexPanel">
        <div className="panLeft80">
          <QuestionsNavigationPanel {...questionsNavPanelProps} />
        </div>
        <div className="panRight20">
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
        {currentQuestion && (
          <>
            <Question {...passThruProps} />
            <ButtonPanel {...buttonsPanelProps} />
          </>
        )}
      </div>
    </div>
  );

  const examOverProps = {
    answerMatrix,
    registrationData,
    navigateAfterTestEnd,
    handleLogOut,
  };

  return isExamOver && answerMatrix.length > 0 ? (
    <ExamOverPage {...examOverProps} />
  ) : (
    testComponent
  );
}

QuestionsPage.propTypes = {
  navigateAfterTestEnd: PropTypes.func,
  selectedLevel: PropTypes.number,
  examTimeLimit: PropTypes.number,
  registrationData: PropTypes.object,
};

export default QuestionsPage;
