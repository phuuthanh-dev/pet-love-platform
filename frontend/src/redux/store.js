import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import postSlice from './postSlice.js';
import chatSlice from "./chatSlice.js";
import rtnSlice from "./rtnSlice.js";
import campaignSlice from "./campaignSlice.js";
import donateSlice from "./donateSlice.js";
import loadingSlice from "./loadingSlice.js";
import sidebarSlice from "./sidebarSlice.js";
import adoptPostSlice from "./adoptPostSlice.js";
import settingSlice from "./settingSlice.js";

import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

const rootReducer = combineReducers({
    auth: authSlice,
    post: postSlice,
    adopt: adoptPostSlice,
    chat: chatSlice,
    realTimeNotification: rtnSlice,
    campaign: campaignSlice,
    donate: donateSlice,
    loading: loadingSlice,
    sidebar: sidebarSlice,
    setting: settingSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});
export default store;