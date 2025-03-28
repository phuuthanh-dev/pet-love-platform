import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  clientSetting: null,
};

const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    setClientSetting: (state, action) => {
      state.clientSetting = action.payload;
    },
  },
});

export const { setClientSetting } = settingSlice.actions;
export default settingSlice.reducer;
