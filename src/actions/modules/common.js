import Cookies from 'js-cookie';
import ApiConstants from '@/apiConfig/apiConstants';
import * as actionTypes from './actionTypes';
import request, { TOKEN_PARAMS } from '@/base/request';
import { useNavigate } from "react-router-dom";
import ResponseCode from '@/apiConfig/ResponseCode';
import { loadEnd, loadStart } from './global';
import { message } from 'antd';


import service from "@/base/request";

const common = {
  //获取课程类型
  getCourseType(params) {
    params.userId = localStorage.getItem("userId")
    return service.request({ url: ApiConstants.HOST_NAME_GET_COURSE_TYPE, method: "get", params });
  },
};

export default common;

