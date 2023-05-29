import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ActiveUser, UserType } from "../../../typing";
import { clearStorage } from "../../utils/localStorage";
import { RootState } from "../store";

export let key = "chappy-local";
export const win = typeof window !== "undefined" ? window : ({} as Window);

export interface UserState {
  user: UserType | null;
  validateUser: any | null;
  activeUsers: ActiveUser[];
}

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    validateUser: null,
    activeUsers: [],
  } as UserState,
  reducers: {
    login: (state: UserState, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      clearStorage(key);
    },
    forget: (state: UserState, action) => {
      state.validateUser = action.payload;
    },
    addActiveUsers: (state: UserState, action: PayloadAction<ActiveUser[]>) => {
      state.activeUsers = action.payload;
    },
  },
});

export const { login, logout, addActiveUsers, forget } = userSlice.actions;

export const selectUser = (state: RootState) => state.user?.user;
export const selectValidateUser = (state: RootState) => state.user.validateUser;
export const selectActiveUser = (state: RootState) => state.user?.activeUsers;

export default userSlice.reducer;
