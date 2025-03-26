import Cookies from 'js-cookie';
import ApiConstants from '@/apiConfig/apiConstants';
import * as actionTypes from './actionTypes';
import request, { TOKEN_PARAMS } from '@/base/request';
import { useNavigate } from "react-router-dom";
import ResponseCode from '@/apiConfig/ResponseCode';
import { loadEnd, loadStart } from './global';
import { message } from 'antd';


import service from "@/base/request";

const login = {
  //登录
  login(params) {
    return service.request({
      url:ApiConstants.HOST_NAME_LOGIN, 
      method: "post", 
      data:params,
      paramsConfig: { 
        headers: {
          // 'dancefamilytoken':  params.dancefamilytoken,
          'Content-Type': 'application/json;charset=UTF-8'
        }, 
      },
    });
  },
  //登出
  logout() {
    return service.request({ url:ApiConstants.HOST_NAME_LOGOUT, method: "post" });
  },
  //后台Web获取图片验证码
  getVerificationCodeImg(params) {
    return service.request({ url: "/verificationCodeImg", method: "get" });
  },
};

export default login;

