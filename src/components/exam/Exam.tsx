import Information from "./Information";
import QuestionsPage from "./QuestionsPage";
import { useState } from "react";
import RegistrationData from "../../dataTypes/RegistrationData";

interface ExamProps {
  registrationData: RegistrationData;
  navigateAfterTestEnd: () => void;
  handleLogOut: () => void;
}

/** Returns the Exam component which renders the questions Page and FinalResult page. */
function Exam(props: ExamProps) {
  const { registrationData, navigateAfterTestEnd, handleLogOut } = props;

  const testEndTime =
    localStorage.getItem("otaTestEndTime") === null
      ? 0
      : Number.parseInt(localStorage.getItem("otaTestEndTime") as string);
  const initialExamLevel =
    localStorage.getItem("otaSelectedLevel") === null
      ? 1
      : Number.parseInt(localStorage.getItem("otaSelectedLevel") as string);
  const [selectedLevel, setSelectedLevel] = useState(initialExamLevel);

  const timeLeft =
    testEndTime > 0 && testEndTime > Date.now() ? testEndTime - Date.now() : 0;

  const [examTimeLimit, setExamTimeLimit] = useState(
    Math.floor(timeLeft / 1000)
  );
  const [rulesAccepted, setRulesAccepted] = useState(testEndTime > 0);

  /**
   * The callback that records seleted level and its time limit for the test.
   * @param selectedLevel
   * @param timeLimit
   */
  const handleStartTest = (selectedLevel: number, timeLimit: number) => {
    localStorage.setItem("otaSelectedLevel", selectedLevel.toString());
    localStorage.setItem(
      "otaTestEndTime",
      (Date.now() + timeLimit * 1000).toString()
    );
    setExamTimeLimit(timeLimit);
    setSelectedLevel(selectedLevel);
    setRulesAccepted(true);
  };

  /**
   * Sets the rules to be not accepted so that information page can be displayed.
   */
  const beforeNavigateAfterTestEnd = () => {
    setRulesAccepted(false);
    navigateAfterTestEnd();
  };

  const informationProps = { handleStartTest, registrationData, handleLogOut };
  /** Exam information component which is rendered when user accepts the rules */
  const examInformation = <Information {...informationProps} />;

  const questionPageProps = {
    selectedLevel,
    examTimeLimit,
    registrationData,
    navigateAfterTestEnd: beforeNavigateAfterTestEnd,
    handleLogOut,
  };
  const questionsPage = <QuestionsPage {...questionPageProps} />;

  let answerMatrixItemPresent = localStorage.getItem("answerMatrix") !== null;
  if (answerMatrixItemPresent) {
    return questionsPage;
  }

  return rulesAccepted ? questionsPage : examInformation;
}
export default Exam;
