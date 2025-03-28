import { createSlice } from "@reduxjs/toolkit";

const donateSlice = createSlice({
  name: 'donate',
  initialState: {
    topDonate: [],
  },
  reducers: {
    setTopDonate: (state, action) => {
      state.topDonate = action.payload;
    },
  },
});
export const { setTopDonate } = donateSlice.actions;
export default donateSlice.reducer;

