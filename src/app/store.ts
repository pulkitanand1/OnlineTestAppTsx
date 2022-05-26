import { configureStore } from "@reduxjs/toolkit";
import levelDataReducer from "../features/exam/levelDataSlice";
import levelWiseQuestionsReducer from "../features/exam/levelWiseQuestionsSlice";
import rulesDataReducer from "../features/exam/rulesDataSlice";

export const store = configureStore({
  reducer: {
    levelData: levelDataReducer,
    rulesData: rulesDataReducer,
    levelWiseQuestionsData: levelWiseQuestionsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
