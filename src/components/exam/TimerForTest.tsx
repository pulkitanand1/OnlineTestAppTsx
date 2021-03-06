import PropTypes from "prop-types";
import "../../Common.scss";

/**
 * This is the timer that runs according to the test time limit.
 * It starts blinking in Red if less than a minute remains.
 * A callback function is called when timelimit lapses for ending the test session.
 * @param props
 * @returns
 */
function TimerForTest(props: any) {
  const { timeLeft } = props;
  let minutesLeft = Math.floor(timeLeft / 60);
  let secondsLeft = timeLeft % 60;
  let className = "timer";

  if (minutesLeft === 0 && secondsLeft > 0) {
    className = "timer-red";
  } else if (minutesLeft > 0 && secondsLeft > 0) {
    className = "timer";
  }
  return (
    <div className="timerContainer" data-testid="testtimer-1">
      <div className="timerBox">
        <h3 className="timeLeft">
          Time Left :{" "}
          <span className={className} data-testid="actualTimer">
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
};

export default TimerForTest;
