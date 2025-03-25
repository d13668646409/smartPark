import axios from 'axios';
import Qs from 'qs';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import ApiConstants from '@/apiConfig/apiConstants';
import ResponseCode from '@/apiConfig/ResponseCode';
import { isObject } from '@/utils/utils';
import { message } from 'antd'
export const TOKEN_PARAMS = 'token_dance_family';
const instance = axios.create({
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "page-url": window.location.href,
  },
  baseURL: ApiConstants.HOST_NAME,
  timeout: 180000
})

// **路由请求拦截**
let dispatch;
instance.interceptors.request.use(
  config => {
    dispatch = config.action
    // 判断是否存在ticket，即判断用户是否登录，如果存在的话，则每个http header都加上ticket
    if (Cookies.get(TOKEN_PARAMS)) {
      config.headers['dancefamilytoken'] = Cookies.get(TOKEN_PARAMS);
    }
    if(config.paramsConfig) {
      Object.keys(config.paramsConfig).map(_k => {
        if(isObject(config.paramsConfig[_k]))
          config[_k] = Object.assign(config[_k], config.paramsConfig[_k])
          else config[_k] = config.paramsConfig[_k]
      })
    }
    if(config.method === 'get') {
      config.data = Qs.stringify(config.data)
    }
    return config;
  },
  error => Promise.reject(error)
);

// http 响应 拦截器
instance.interceptors.response.use((response) => {
  console.log(response)
  if(response.config.responseType=='blob'){
    return Promise.resolve(response.data)
  }
  if (response.data && (response.data.code === ResponseCode.UN_LOGIN_OR_EXPIRED)) {
    Cookies.remove(TOKEN_PARAMS);
    console.log("test1");
    useNavigate('/login');
    return Promise.reject(response || 'error')
  } else if(response.data && (response.data.code === ResponseCode.SUCCESS)){
    if (response.config.url == `${ApiConstants.HOST_NAME}/login`  && response.headers.dancefamilytoken) {
      Cookies.set(TOKEN_PARAMS,response.headers.dancefamilytoken)
    }
    return Promise.resolve(response.data)
  } else if(response.data && ([ResponseCode.ERROR,ResponseCode.NO_MENU_AUTHORITY,ResponseCode.BAD_CREDENTIALS].includes(response.data.code))){
    message.error(response.data.msg)
    return Promise.resolve(response.data)
  }else{
    return Promise.resolve(response.data)
  }
}, (error) => {
  if (error.response) {
    console.log(error.response);
    return Promise.reject(error.response.data);
  }
  if (error.message) {
    console.log(error.message);
    return Promise.resolve(error);
  }
  return Promise.reject(error);
});

export default instance;
