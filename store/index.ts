import {configureStore, ThunkAction, Action} from "@reduxjs/toolkit";
import rootReducer from "./reducers/root";
import thunk from "redux-thunk";
import logger from "./middlewares/logger";
import {createWrapper} from "next-redux-wrapper";

const store = configureStore({
  reducer: {
    rootReducer,
  },
  middleware: [thunk, logger],
});

export type AppStore = ReturnType<any>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

const makeStore = () => store;

export const wrapper = createWrapper<AppStore>(makeStore);
