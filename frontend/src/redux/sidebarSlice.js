import { createSlice } from "@reduxjs/toolkit";

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    isDisplayText: false,
    showSearchTab: false,
    showNotificationTab: false,
  },
  reducers: {
    setIsDisplayText: (state, action) => {
      state.isDisplayText = action.payload;
    },
    setShowSearchTab: (state, action) => {
      state.showSearchTab = action.payload;
    },
    setShowNotificationTab: (state, action) => {
      state.showNotificationTab = action.payload;
    },
  },
});

export const { setIsDisplayText, setShowNotificationTab, setShowSearchTab } = sidebarSlice.actions;
export default sidebarSlice.reducer;
