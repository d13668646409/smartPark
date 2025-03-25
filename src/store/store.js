// src/store/index.js

import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers';

// 创建并导出store
const store = configureStore({
  reducer: rootReducer,
});

export default store;

