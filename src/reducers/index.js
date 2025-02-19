// src/reducers/index.js
import { combineReducers } from '@reduxjs/toolkit';
import globalReducer from './globalReducer';

// 将多个reducer合并为一个RootReducer
const rootReducer = combineReducers({
    global: globalReducer,
});

export default rootReducer;

