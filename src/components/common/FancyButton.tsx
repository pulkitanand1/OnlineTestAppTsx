import PropTypes from "prop-types";
import "./FancyButton.scss";

/** A component that returns a sytlized button handling submit and click events on the basis of property. */
function FancyButton(props: any) {
  const buttonText = props.buttonText;
  const isDisabled = props.isDisabled;
  const onClickAction = props.onClickAction;
  const isSubmit = props.isSubmit;

  return (
    <div className="buttonArea">
      <button
        type={isSubmit ? "submit" : "button"}
        role="button"
        className="blackButton"
        disabled={isDisabled}
        onClick={!isSubmit ? onClickAction : null}
      >
        {buttonText}
        {props.children}
      </button>
    </div>
  );
}

FancyButton.propTypes = {
  buttonText: PropTypes.string,
  isDisabled: PropTypes.bool,
  onClickAction: PropTypes.func,
  isSubmit: PropTypes.bool,
  children: PropTypes.any,
};

export default FancyButton;
