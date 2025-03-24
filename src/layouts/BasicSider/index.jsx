
import React, { useState, useEffect } from 'react'
import { Layout, Menu } from 'antd'
import { useLocation} from "react-router-dom";
import style from './index.module.scss'
import route from '@/routes'
import { getRolesRoute } from '@/utils/utils'
const { Sider } = Layout

const BasicSider = (props) => {
    const [defaultSelected, setDefaultSelected] = useState({})
    const [sideNav,setSideNav]  = useState([])
    const location =useLocation()
    /**
    * @description: 展开操作列项
    * @param {*} type 操作类型 subMenu/menuItem
    * @param {*} item 操作数值
    * @return {*}
    */  
    const handlerMenuItem = (type, item) => {
      let _defaultSelected = { ...defaultSelected }
      if (type === 'subMenu') _defaultSelected.pathkey = item
      else {
        _defaultSelected.pathname = [item.key]
        window.location.hash ='#'+ item.key
        props.navigate(item.key)
      } 
      setDefaultSelected(_defaultSelected)
    }
    useEffect(()=>{
        const arr  = getRolesRoute(route.sideNav)
        setSideNav(arr)
       console.log(arr)
    },[route])
    useEffect(()=>{
      let _defaultSelected = { ...defaultSelected }
      const arr= location.pathname.split('/')
      let _arr = arr.filter(v=>v!="")
      if(_arr.length>1){
        _defaultSelected.pathkey = ['/'+_arr[0]]
      } 
       _defaultSelected.pathname = [location.pathname]
      setDefaultSelected(_defaultSelected)
    },[location])
    return (
        <Sider style={{height:"100%"}} >
            <div className={style.side}>
                <Menu theme="dark" mode="inline" onOpenChange={(ev) => handlerMenuItem('subMenu', ev)}
                  selectedKeys={defaultSelected.pathname} onClick={(ev) => handlerMenuItem('menuItem', ev)}
                  openKeys={defaultSelected.pathkey}
                  className={style.menu_name}
                  items={sideNav}
                />
            </div>
        </Sider>
    )
}
export default BasicSider