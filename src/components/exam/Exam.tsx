import Information from "./Information";
import QuestionsPage from "./QuestionsPage";
import { useState } from "react";
import PropTypes from "prop-types";

/** Returns the Exam component which renders the questions Page and FinalResult page. */
function Exam(props: any) {
  const { registrationData, navigateAfterTestEnd } = props;
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

  /** Exam information component which is rendered when user accepts the rules */
  const examInformation = (
    <Information
      acceptRules={acceptRules}
      registrationData={registrationData}
    />
  );

  const passThruExamProps = {
    selectedLevel,
    examTimeLimit,
    registrationData,
    navigateAfterTestEnd: beforeNavigateAfterTestEnd,
  };
  const questionsPage = <QuestionsPage {...passThruExamProps} />;

  return rulesAccepted ? questionsPage : examInformation;
}

Exam.propTypes = {
  registrationData: PropTypes.object,
  navigateAfterTestEnd: PropTypes.func,
};
export default Exam;
