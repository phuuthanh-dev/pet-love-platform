import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name:"chat",
    initialState:{
        onlineUsers:[],
        messages:[],
        isSurveyActive: false,
    },
    reducers:{
        // actions
        setOnlineUsers:(state,action) => {
            state.onlineUsers = action.payload;
        },
        setMessages:(state,action) => {
            state.messages = action.payload;
        },
        setSurveyActive: (state, action) => { 
            state.isSurveyActive = action.payload;
        },
    }
});
export const {setOnlineUsers, setMessages, setSurveyActive} = chatSlice.actions;
export default chatSlice.reducer;