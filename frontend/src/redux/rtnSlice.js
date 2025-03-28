import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
  name: "realTimeNotification",
  initialState: {
    notifications: [], // Khởi tạo là mảng rỗng
  },
  reducers: {
    setNotifications: (state, action) => {
      // Nếu payload là mảng, gán trực tiếp
      if (Array.isArray(action.payload)) {
        state.notifications = action.payload;
      }
      // Nếu payload là object (thông báo đơn), thêm vào mảng
      else if (action.payload && typeof action.payload === "object") {
        state.notifications.push(action.payload);
      }
      // Nếu payload không hợp lệ, giữ nguyên trạng thái hiện tại
      else {
        console.warn("Invalid payload for setNotifications:", action.payload);
      }
    },
    // Tùy chọn: Thêm reducer để xóa thông báo nếu cần
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (item) => item._id !== action.payload
      );
    },
  },
});

export const { setNotifications, removeNotification } = rtnSlice.actions;
export default rtnSlice.reducer;
