import PropTypes from "prop-types";
import "../Common.scss";

function TimerForTest(props: any) {
  let minutesLeft = Math.floor(props.timeLeft / 60);
  let secondsLeft = props.timeLeft % 60;
  let className = "timer";

  if (minutesLeft === 0 && secondsLeft > 0) {
    className = "timer-red";
  } else if (minutesLeft > 0 && secondsLeft > 0) {
    className = "timer";
  }

  return (
    <div className="timerContainer">
      <div className="timerBox">
        <h3 className="timeLeft">
          Time Left :{" "}
          <span className={className}>
            {minutesLeft.toString().padStart(2, "0")} :{" "}
            {secondsLeft.toString().padStart(2, "0")}
          </span>
        </h3>
      </div>
    </div>
  );
}

TimerForTest.propTypes = {
  timeLeft: PropTypes.number,
  stopCountDown: PropTypes.func,
};

export default TimerForTest;
