
import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Layout, Tooltip,Dropdown } from 'antd'
import { TOKEN_PARAMS } from '@/base/request';
import {CfmtModal} from '@/components'
import style from './index.module.scss'
import logo from "@/asstes/images/logo.png"
import exit from "@/asstes/images/exit.png"
const { Header } = Layout

const items = [
    {
        key:"1",
        label:(
            <span >个人信息</span>
        )
    },
    {
        key:"2",
        label:(
            <span>我的历史</span>
        )
    },
    {
        key:"3",
        label:(
            <span>修改密码</span>
        )
    },
]

const BasicHeader = (props) => {

    const [isshow,setIsshow] = useState(false)
    const submit = (e)=>{
        if(e=="yes")logout()
        else handleCancle()
    }
    const logout = () => {
        console.log("tuichu ")
        Cookies.remove(TOKEN_PARAMS);
        props.navigate('/')
        handleCancle()
    }
    const handleCancle = ()=>{
        setIsshow(false)
    }
    const goCockpit = ()=>{
        props.navigate('/cockpit')
    }
    return (
        <Header>
            <div className={style.headPage}>
                <div className={style.leftHeader} onClick={()=>goCockpit()}>
                    <img className={style.logo} src={logo} />
                    <div className={style.headTitle}>
                        App测试系统
                    </div>
                </div>
                <div className={style.rightHeader}>
                    <div className={style.title}>
                        <span className={style.account}>张三</span>
                        <Dropdown
                            menu={{
                                items,
                              }}
                              trigger={['click']}
                              placement="bottomRight"
                        >
                            <DownOutlined />
                        </Dropdown>
                    </div>
                    <Tooltip title="退出">
                        <img className={style.logout} src={exit} alt='退出' onClick={() => setIsshow(true)} />
                    </Tooltip>
                </div>
            </div>
            <CfmtModal 
                show = {isshow}
                conent = "是否确定退出登录!"
                onHandleCancle = {handleCancle}
                onSubmit = {(e)=>submit(e)}
            />
        </Header>
    )
}
export default BasicHeader