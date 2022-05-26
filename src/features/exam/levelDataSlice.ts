import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { Level } from "../../dataTypes/Level";

const initialValue = [] as Level[];

export const levelDataSlice = createSlice({
  name: "levelDataSlice",
  initialState: {
    value: initialValue,
  },
  reducers: {
    setLevelsData: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const selectLevelsData = (state: RootState) => state.levelData.value;
export const { setLevelsData } = levelDataSlice.actions;
const levelDataReducer = levelDataSlice.reducer;
export default levelDataReducer;
