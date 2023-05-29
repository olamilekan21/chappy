import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type PopupState = {
  type: string | null;
  data?: any;
};

export const popupSlice = createSlice({
  name: "popup",
  initialState: {
    type: null,
    data: null,
  },
  reducers: {
    handleOpen: (
      state: PopupState,
      action: PayloadAction<{ type: string; data?: any }>
    ) => {
      let payload = action.payload;
      state.type = payload.type;
      state.data = payload?.data ?? null;
    },
    handleClose: (state: PopupState) => {
      state.type = null;
      state.data = null;
    },
  },
});

export const { handleClose, handleOpen } = popupSlice.actions;

export const selectPopup = (state: RootState) => state.popup;

export default popupSlice.reducer;
