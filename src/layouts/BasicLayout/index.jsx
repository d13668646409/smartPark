import React,{useState,useEffect}from 'react';
import { Breadcrumb, Layout,notification} from 'antd';
import { useLocation,Outlet} from "react-router-dom";
import ApiConstants from '@/apiConfig/apiConstants';
import { connectWebsocket, closeWebsocket } from '@/utils/webScoket.js'
import BasicHeader from '../BasicHeader'
import BasicSider from '../BasicSider'
// import BasicContent from '../BasicContent'
import style from './index.module.scss'
const { Footer, Content } = Layout;

const BasicLayout = (props) => {
    const location = useLocation();
    const loginOut = ()=>{
        closeWebsocket()
    }
    const resetPass=()=>{

    }
    useEffect(()=>{
        connectWebsocket(ApiConstants.HOST_NAME_WS_MESSAGE+"/"+localStorage.getItem("userId"),"",res=>{
            if(res){
              notification.open({
                message: '消息通知',
                description:res,
                duration: 0,
              });
            }
          },err=>{
            console.log(err)
          })
    },[localStorage.getItem("userId")])
    return (
        <div id="page" className={style.page}>
            <Layout>
                <BasicHeader {...props} loginOut={loginOut} resetPass={resetPass} />
                <Layout hasSider >
                  <BasicSider {...props}/>
                  <Content style={{
                    display:"flex",
                    flexDirection:"column",
                    justifyContent:"space-between",
                    height:"100%",
                    }}>
                    <div className={style.layoutCon}>   
                        <Outlet/>
                    </div>
                    <Footer
                    style={{
                        textAlign: 'center',
                      }}
                > Ant Design ©2023 Created by Ant UED</Footer>
                  </Content>
                </Layout>
            </Layout>
        </div>
    
    )
}
export default BasicLayout