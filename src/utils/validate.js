

import React from 'react'

/**
 * @description: 获取查询结果
 * @param {*} type
 * @param {*} value
 * @return {*}
 */
export const handlerValue = (type, value) =>{
  if(type === 'getValue') return value
}
/**
 * @description: 获取组件化上下文对象
 * @param {*}
 * @return {*}
 */
export const MyContext = React.createContext(null)
/**
 * @description: 初始化state仓库
 * @param {*}
 * @return {*}
 */
export const initState = () => {
  return { loadingStatus: false }
}
/**
 * @description: reducer动作 更改按钮加载状态
 * @param {*} state 仓库
 * @param {*} type 类型
 * @return {*}
 */
export const loadingStatusReducer = (state, { type }) => {
  switch(type) {
    case 'start':
      return { loadingStatus: true }
    case 'end':
      return { loadingStatus: false }
    default: 
      return state
  }
}


export const validate_password = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{2,5}$/;

/**
 * @description: 列表默认初始数据
 * @param {*}
 * @return {*}
 */
export const tableDefaultConfig = { current: 1, size: 10 };
/**
 * @description: 列表默认初始数据
 * @param {*}
 * @return {*}
 */
export const selectOptionsCode = [
  // { code: 接口请求code参数, name: 列表对照类型, options: 列表对照参数 },
];

/**
 * @description: 列表默认初始数据
 * @param {*} { label: 列表项名称, value: 对照值, id: key值 }
 * @return {*}
 */
/*[
  danceType: 舞蹈类型-证书管理,
  danceLevel: 舞蹈等级-证书管理,
  sysRoles_more: 用户列表-权限管理(多选),
  realRoles_more: 角色管理-角色(多选)
]
*/
export const defaultSelectOptions = {
  examinationState: [
    { label: '待复核', value: '100', id: '01' },
    { label: '已制证', value: '300', id: '02' },
    { label: '作废', value: '400', id: '03' },
  ],  //证书状态-证书管理
  examinationStateS: [
    { label: '作废', value: '400', id: '02' },
    { label: '正常', value: '300', id: '01' },
  ],  //证书状态-证书管理
  examinationStateT: [
    { label: '失效', value: '500', id: '02' },
    { label: '正常', value: '300', id: '01' },
    { label: '作废', value: '400', id: '03' },
  ],  //证书状态-证书管理
  searchType: [
    { label: '姓名', value: '1', id: '01' },
    { label: '证书编号', value: '2', id: '02' },
    { label: '身份信息', value: '3', id: '03' },
  ],  //搜索类型-证书管理
  searchType_: [
    { label: '证书编号', value: '2', id: '01' },
    { label: '身份信息', value: '3', id: '02' },
  ],  //搜索类型-证书管理
  certificateType: [
    { label: '全部', value: '0', id: '01' },
    { label: '学生', value: '1', id: '02' },
    { label: '老师', value: '2', id: '03' },
  ],  //证书类型-证书管理
  examSoreS: [
    { label: '全部成绩', value: '0', id: '01' },
    { label: '合格', value: '1', id: '02' },
    { label: '不合格', value: '14', id: '03' },
  ],  //考试成绩-证书管理
  examSoreT: [
    { label: '全部成绩', value: '0', id: '01' },
    { label: '合格', value: '1', id: '02' },
    { label: '不合格', value: '14', id: '03' },
    { label: '中国舞实习', value: '4', id: '04' },
    { label: '芭蕾舞实习', value: '16', id: '05' },
  ],  //考试成绩-证书管理
  printStatus:[
    { label: '全部', value: '3', id: '01' },
    { label: '已打印', value: '1', id: '02' },
    { label: '未打印', value: '0', id: '03' },
  ],//打印状态-证书管理
  radioStatus: [
    { label: '启用', value: true, id: '01' },
    { label: '禁用', value: false, id: '02' },
  ],  //是否启用-权限管理
}
