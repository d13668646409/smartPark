
import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "home", // 命名空间，在调用action的时候会默认的设置为action的前缀
  // 初始值
  initialState: {
    loadingShow:false,
  },
  // 这里的属性会自动的导出为actions，在组件中可以直接通过dispatch进行触发
  reducers: {
    loadStart(state, { payload }) {
        state.loadingShow = true; // 内置了immutable
    },
    loadEnd(state) {
        state.loadingShow = false;
    },
  },
});

// 导出actions
export const { loadStart, loadEnd } = counterSlice.actions;

// 内置了thunk插件，可以直接处理异步请求
export const asyncIncrement = (payload) => (dispatch) => {
  setTimeout(() => {
    dispatch(loadEnd(payload));
  }, 2000);
};

export default counterSlice.reducer; // 导出reducer，在创建store时使用到

