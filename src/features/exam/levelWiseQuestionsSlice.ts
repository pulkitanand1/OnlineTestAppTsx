import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { QuestionDataItem } from "../../dataTypes/QuestionDataItem";

const levelWiseQuestionsSlice = createSlice({
  name: "levelWiseQuestionsSlice",
  initialState: {
    value: [] as QuestionDataItem[],
  },
  reducers: {
    setLevelWiseQuestionsData: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setLevelWiseQuestionsData } = levelWiseQuestionsSlice.actions;
export const selectLevelWiseQuestionsData = (state: RootState) =>
  state.levelWiseQuestionsData.value;

const levelWiseQuestionsReducer = levelWiseQuestionsSlice.reducer;
export default levelWiseQuestionsReducer;
