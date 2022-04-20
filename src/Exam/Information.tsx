import "./Information.scss";
import "../Common.scss";
import * as dp from "../DataProvider";
import PropTypes from "prop-types";
import { useState } from "react";

function ExamInformation(props: any) {
  const { acceptRules } = props;
  const rules = dp.getRules();
  const levels = dp.getLevels();
  const [examLevel, setExamlLevel] = useState(levels[0]);
  const [isChecked, setIsChecked] = useState(false);

  function handleLevelSelection(e: any) {
    let eLevel = levels.find((l) => l.id === parseInt(e.target.value));
    if (eLevel) {
      setExamlLevel(eLevel);
    }
  }

  const rulesAndRegulations = (
    <div className="rules">
      <div className="rulesList">
        <h1>Exam Information</h1>
        <ol>
          {rules.map((rule) => (
            <li value={rule.id} key={rule.id}>
              {rule.ruleText}
            </li>
          ))}
        </ol>
      </div>
      <div className="examStartPanel">
        <div>
          <h2>Select the exam level</h2>
          <select onChange={handleLevelSelection} required>
            {levels.map((lv) => (
              <option key={lv.id} value={lv.id}>
                {lv.value}
              </option>
            ))}
          </select>
          {examLevel && <p>Time limit is {examLevel.timeLimit} seconds</p>}
        </div>
        <div>
          <p className="acceptanceText">
            {" "}
            <input
              type="checkbox"
              onChange={(e) => {
                setIsChecked(e.target.checked);
              }}
            />{" "}
            I agree with <b>terms and conditions</b>.
          </p>
        </div>
        <div>
          <button
            onClick={() => acceptRules(examLevel.id, examLevel.timeLimit)}
            disabled={!isChecked}
            className="greenButton"
          >
            Start Test
          </button>
        </div>
      </div>
    </div>
  );
  return rulesAndRegulations;
}

ExamInformation.propTypes = {
  acceptRules: PropTypes.func,
};

export default ExamInformation;
