let HOST_NAME,HOST_NAME_GUI,HOST_NAME_WS
switch (process.env.NODE_ENV) {
  case 'development':
    HOST_NAME = 'http://192.168.100.83:9202';// cz
    HOST_NAME_WS = 'ws://192.168.100.83:9202';// cz  webscoket
    HOST_NAME_GUI = 'http://192.168.100.83:9203';// gui
    break;
  case 'production':
    HOST_NAME = 'http://183.247.176.143:9202';// cz
    HOST_NAME_WS = 'ws://183.247.176.143:9202';//  cz  webscoket
    HOST_NAME_GUI = 'http://183.247.176.143:9203';// gui
    break;
  default:
    HOST_NAME = 'http://192.168.100.83:9202';// cz
    HOST_NAME_WS = 'ws://192.168.100.83:9202';// cz  webscoket
    HOST_NAME_GUI = 'http://192.168.100.83:9203';// gui
}

export default {
    HOST_NAME_LOGIN: HOST_NAME + '/Login/login',//登录
    HOST_NAME_LOGOUT: HOST_NAME + '/logout',//登出
    HOST_NAME_GET_USERINFO: HOST_NAME + '/userInfo/getUserInfo',//获取当前账号详细信息

    HOST_NAME_GET_COURSE_TYPE: HOST_NAME + '/api/Type',//获取课程类型
      
    HOST_NAME_WS_MESSAGE:HOST_NAME_WS + '/api/webSocket'//websocket
};