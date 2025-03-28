import { createSlice } from "@reduxjs/toolkit";
const campaignSlice = createSlice({
    name: 'campaign',
    initialState: {
        campaigns: [],
    },
    reducers: {
        setCampaigns: (state, action) => {
            state.campaigns = action.payload;
        }
    }
});
export const { setCampaigns } = campaignSlice.actions;
export default campaignSlice.reducer;
