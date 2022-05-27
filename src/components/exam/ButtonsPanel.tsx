import FancyButton from "../common/FancyButton";

/**
 * Button panel that comprises of "Previous Question", "Next Question" and "Submit" buttons.
 */

interface buttonPanelProps {
  handleGoToPreviousQuestion: () => void;
  handleGoToNextQuestion: () => void;
  currentQuestionIndex: number;
  totalQuestions: number;
  handleFinishTest: () => void;
}
const ButtonPanel = (props: buttonPanelProps) => {
  const {
    handleGoToPreviousQuestion,
    handleGoToNextQuestion,
    currentQuestionIndex,
    totalQuestions,
    handleFinishTest,
  } = props;
  return (
    <div className="questionNavButtonPanel">
      <div className="panLeft">
        <FancyButton
          buttonText="Previous Question"
          onClickAction={handleGoToPreviousQuestion}
          isDisabled={currentQuestionIndex === 0}
        />
        <FancyButton
          buttonText="Next Question"
          onClickAction={handleGoToNextQuestion}
          isDisabled={currentQuestionIndex === totalQuestions - 1}
        />
      </div>
      <div className="panRight">
        <FancyButton buttonText="Submit" onClickAction={handleFinishTest} />
      </div>
    </div>
  );
};

export default ButtonPanel;
