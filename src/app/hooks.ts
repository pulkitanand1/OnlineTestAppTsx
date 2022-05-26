import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

/**
 * HOF for useDispatch for AppDispatch.
 * @returns HOF that returns the useDispatch hook for the type defined.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * TypedUseSelectorHook that takes the state type and returns the app.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
