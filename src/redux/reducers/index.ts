import { combineReducers } from "@reduxjs/toolkit";
import configuration from "./configuration";
import selectedVideoPage from "./selectedVideoPage";




export const reducers = combineReducers({ configuration, selectedVideoPage });

export type RootState = ReturnType<typeof reducers>;
