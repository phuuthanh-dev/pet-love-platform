import { createSlice } from "@reduxjs/toolkit";
const adoptPostSlice = createSlice({
  name: 'adoptPost',
  initialState: {
    adoptPosts: [],
    selectedAdoptPost: null,
    page: 1
  },
  reducers: {
    //actions
    setAdoptPosts: (state, action) => {
      state.adoptPosts = action.payload;
    },
    setSelectedAdoptPost: (state, action) => {
      state.selectedAdoptPost = action.payload;
    },
    setAdoptPostPage: (state, action) => {
      state.page = action.payload;
    }
  }
});
export const { setAdoptPosts, setSelectedAdoptPost, setAdoptPostPage } = adoptPostSlice.actions;
export default adoptPostSlice.reducer;