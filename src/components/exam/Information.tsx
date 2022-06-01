import "./Information.scss";
import "../../Common.scss";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectLevelsData } from "../../features/exam/levelDataSlice";
import { selectRulesData } from "../../features/exam/rulesDataSlice";
import {
  updateLevelsData,
  updateRulesData,
} from "../../features/exam/examDataProvider";
import { Level } from "../../dataTypes/Level";
import RegistrationData from "../../dataTypes/RegistrationData";
import WelcomeUser from "./WelcomUser";

interface InformationProps {
  handleStartTest: (selectedLevel: number, timeLimit: number) => void;
  registrationData: RegistrationData;
  handleLogOut: () => void;
}

/** Returns the Exam Information Component  */
function Information(props: InformationProps) {
  const { handleStartTest, registrationData, handleLogOut } = props;
  const levels = useAppSelector(selectLevelsData);
  const rules = useAppSelector(selectRulesData);
  const [examLevel, setExamLevel] = useState(
    levels.find((l) => l.id === 1) as Level
  );
  const dispatch = useAppDispatch();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    updateRulesData(dispatch);
    updateLevelsData(dispatch);
  }, []);

  useEffect(() => {
    setExamLevel(levels.find((l) => l.id === 1) as Level);
  }, [levels]);

  /** Handles the level selection event.
   */
  function handleLevelSelection(e: any) {
    let eLevel = levels.find((l) => l.id === parseInt(e.target.value));
    if (eLevel) {
      setExamLevel(eLevel);
    }
  }

  const welcomeUserProps = { registrationData, handleLogOut };

  /** Returns rules and regulations along with level selection drop down, and rules acceptance checkbox. */
  const rulesAndRegulations = (
    <div>
      <WelcomeUser {...welcomeUserProps} />
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
            <select
              onChange={handleLevelSelection}
              defaultValue={examLevel?.id}
              required
            >
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
                defaultChecked={isChecked}
                onChange={(e) => {
                  setIsChecked(e.target.checked);
                }}
              />{" "}
              I agree with <b>terms and conditions</b>.
            </p>
          </div>
          <div>
            <button
              onClick={() => handleStartTest(examLevel.id, examLevel.timeLimit)}
              disabled={!isChecked}
              className="greenButton"
            >
              Start Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  return rulesAndRegulations;
}
export default Information;
