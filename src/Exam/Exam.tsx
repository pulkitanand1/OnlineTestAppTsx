import Information from "./Information";
import QuestionsPage from "./QuestionsPage";
import { useState } from "react";
import PropTypes from "prop-types";

function Exam(props: any) {
  const { registrationData, navigateAfterTestEnd } = props;
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [examTimeLimit, setExamTimeLimit] = useState(1);

  const acceptRules = (selectedLevel: number, timeLimit: number) => {
    if (rulesAccepted === false) {
      setExamTimeLimit(timeLimit);
      setSelectedLevel(selectedLevel);
      setRulesAccepted(true);
    }
  };
  const examInformation = <Information acceptRules={acceptRules} />;

  const passThruExamProps = {
    selectedLevel,
    examTimeLimit,
    registrationData,
    navigateAfterTestEnd,
  };
  const questionsPage = <QuestionsPage {...passThruExamProps} />;

  return rulesAccepted ? questionsPage : examInformation;
}

Exam.propTypes = {
  registrationData: PropTypes.object,
  navigateAfterTestEnd: PropTypes.func,
};
export default Exam;
