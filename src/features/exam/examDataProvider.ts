import { AppDispatch } from "../../app/store";
import * as dp from "../APIs/DataAPI";
import { setLevelsData } from "./levelDataSlice";
import { setLevelWiseQuestionsData } from "./levelWiseQuestionsSlice";
import { setRulesData } from "./rulesDataSlice";

export const updateLevelsData = (dispatch: AppDispatch) => {
  dispatch(setLevelsData(dp.getLevels()));
};

export const updateRulesData = (dispatch: AppDispatch) => {
  dispatch(setRulesData(dp.getRules()));
};

export const updateLevelWiseQuestionData = (
  dispatch: AppDispatch,
  level: number
) => {
  dispatch(setLevelWiseQuestionsData(dp.getExamData(level)));
};
