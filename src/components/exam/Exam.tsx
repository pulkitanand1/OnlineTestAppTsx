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
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [examTimeLimit, setExamTimeLimit] = useState(1);

  /**
   * The callback that records seleted level and its time limit for the test.
   * @param selectedLevel
   * @param timeLimit
   */
  const acceptRules = (selectedLevel: number, timeLimit: number) => {
    if (rulesAccepted === false) {
      setExamTimeLimit(timeLimit);
      setSelectedLevel(selectedLevel);
      setRulesAccepted(true);
    }
  };

  /**
   * Sets the rules to be not accepted so that information page can be displayed.
   */
  const beforeNavigateAfterTestEnd = () => {
    setRulesAccepted(false);
    navigateAfterTestEnd();
  };

  const examInfoProps = { acceptRules, registrationData, handleLogOut };
  /** Exam information component which is rendered when user accepts the rules */
  const examInformation = <Information {...examInfoProps} />;

  const passThruExamProps = {
    selectedLevel,
    examTimeLimit,
    registrationData,
    navigateAfterTestEnd: beforeNavigateAfterTestEnd,
    handleLogOut,
  };
  const questionsPage = <QuestionsPage {...passThruExamProps} />;

  return rulesAccepted ? questionsPage : examInformation;
}
export default Exam;
