import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { RuleItem } from "../../dataTypes/RuleItem";

const initialValue = [] as RuleItem[];

export const rulesDataSlice = createSlice({
  name: "rulesDataSlice",
  initialState: {
    value: initialValue,
  },
  reducers: {
    setRulesData: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { setRulesData } = rulesDataSlice.actions;
export const selectRulesData = (state: RootState) => state.rulesData.value;
const rulesDataReducer = rulesDataSlice.reducer;
export default rulesDataReducer;
