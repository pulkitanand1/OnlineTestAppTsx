import "./Information.scss";
import "../../Common.scss";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectLevelsData } from "../../features/exam/levelDataSlice";
import { selectRulesData } from "../../features/exam/rulesDataSlice";
import {
  updateLevelsData,
  updateRulesData,
} from "../../features/exam/examDataProvider";
import { Level } from "../../dataTypes/Level";

/** Returns the Exam Information Component  */
function Information(props: any) {
  const { acceptRules } = props;
  const levels = useAppSelector(selectLevelsData);
  const rules = useAppSelector(selectRulesData);
  const dispatch = useAppDispatch();
  const [examLevel, setExamlLevel] = useState({} as Level);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    updateRulesData(dispatch);
    updateLevelsData(dispatch);
    setExamlLevel(levels[0]);
  }, []);

  useEffect(() => {
    setExamlLevel(levels[0]);
  }, [levels]);

  /** Handles the level selection event.
   */
  function handleLevelSelection(e: any) {
    let eLevel = levels.find((l) => l.id === parseInt(e.target.value));
    if (eLevel) {
      setExamlLevel(eLevel);
    }
  }

  /** Returns rules and regulations along with level selection drop down, and rules acceptance checkbox. */
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

Information.propTypes = {
  acceptRules: PropTypes.func,
};

export default Information;
