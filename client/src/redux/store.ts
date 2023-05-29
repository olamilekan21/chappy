import {
  CombinedState,
  PayloadAction,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import { HYDRATE, createWrapper } from "next-redux-wrapper";
import popup, { type PopupState } from "./features/popupSlice";
import user, { type UserState } from "./features/userSlice";

export type RootState = {
  user: UserState;
  popup: PopupState;
};

const combinedReducer = combineReducers({
  user,
  popup,
});

const masterReducer = (state: any, action: PayloadAction<any>) => {
  // if (action.type === "state/updateState") {
  //   const nextState = {
  //     ...state,
  //     state: {
  //       ...state.state,
  //       [action.payload.key]: action.payload.value,
  //     },
  //   };
  //   return nextState;
  // }

  if (action.type === HYDRATE) return action.payload;

  return combinedReducer(state, action);
};

export const makeStore = () =>
  configureStore({
    reducer: masterReducer as any,
  });

export const wrapper = createWrapper(makeStore);
