import React,{useEffect,useRef, useState} from "react";
import Cookies from 'js-cookie';
import { Form, Input, Spin,Button,message } from 'antd'
import { getInterfaceData, checkPassword, checkAccount } from '@/utils/utils'
import { closeWebsocket } from '@/utils/webScoket.js'
import { TOKEN_PARAMS } from '@/base/request';
import style from './index.module.scss'
const  Login = (props) =>{
    const [loading,setLoading] = useState(false)
    const [loginForm] = Form.useForm();
    const goTest=()=>{
      Cookies.set(TOKEN_PARAMS,"123",{ expires: 7 })
      localStorage.setItem("Author","admin")
      props.navigate('/cockpit')
    }
    const handleSubmit= ()=>{
      loginForm.validateFields().then(res => {
        //成功时操作
        login(res)
      }).catch((error) => {
        console.log("error");
      })
    }
    const login = async(v) => {
      setLoading(true)
      let params = {
        account:v.username,
        password:v.password
      }
      // let res = await getInterfaceData('login', params);
      // console.log(res)
      // if (res.code == 1) {
        message.success("登录成功");
        setTimeout(() => {
          props.navigate('/cockpit');
        }, 800);
        let data = {
          account: "xuw0471",
          author: "1",
          department: "900018230",
          dingdingUserId: "219911601",
          id: 1651,
          passWord: "tw123456",
          phone: "13605718440",
          username: "徐伟"
        };
        Cookies.set(TOKEN_PARAMS,"123",{ expires: 7 })
        localStorage.setItem("userInfo", JSON.stringify(data))
        localStorage.setItem("Author","admin")
      // } else {
      //   message.error(res.msg);
      //   Cookies.remove(TOKEN_PARAMS);
      // }
      setLoading(false)
    }
    useEffect(()=>{
      if(Cookies.get(TOKEN_PARAMS)) props.navigate('/');
      else closeWebsocket()
    },[])
    return (
      <div className={style.loginPage}>
        <div className={style.main}>
          <div className={style.title}>
            <img src={require("@/asstes/images/icon.png")}/>
            <span>登录</span>
          </div>
          <div className={style.formCon}>
          <Form
             form={loginForm}
             labelCol={{ span: 0, }}
             wrapperCol={{ span: 24, }}
             
          >
            <Form.Item
                label=""
                name="username"
                rules={[
                  { required: true, message: "" },
                  {
                    validator: (_, value) => {
                      let obj = checkAccount(value)
                      if (obj.returnFlag) {
                        return Promise.resolve()
                      } else {
                        return Promise.reject(obj.msg)
                      }
                    }
                  }
                ]}
              >
                <Input
                  maxLength={20}
                  style={{ height: "40px", backgroundColor: "#fff", borderTop: "none", borderLeft: "none", borderRight: "none" }} placeholder="账号" />
              </Form.Item>
              <Form.Item
                label=""
                name="password"
                rules={[
                  { required: true, message: '', },
                  {
                    validator: (_, value) => {
                      let username = loginForm.getFieldsValue().username;
                      let obj = checkPassword(username, value)
                      if (obj.returnFlag) {
                        return Promise.resolve()
                      } else {
                        return Promise.reject(obj.msg)
                      }
                    }
                  }
                ]}
              >
                <Input.Password
                  maxLength={16}
                  style={{ height: "40px", backgroundColor: "#fff", borderTop: "none", borderLeft: "none", borderRight: "none" }} placeholder="密码" />
              </Form.Item>
              <Button loading={loading} onClick={handleSubmit} className={style.loginBtn} type="primary" htmlType="submit">登录</Button>
            </Form>
          </div>
        </div>
      </div>
    );
  }

  export default Login