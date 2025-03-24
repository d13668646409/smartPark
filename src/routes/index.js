import {lazy} from 'react';
import { TeamOutlined } from "@ant-design/icons"

const Home = lazy(() => import('../views/home'));
const Test = lazy(() => import('../views/test'));
const About = lazy(() => import('../views/about'));


const routes = {
    sideNav:[
        {
            label:"主页",
            key:"/",
            icon:<TeamOutlined/>,
            component:<Home/>,
        },
        {
            label:"测试",
            key:"/test",
            roles:["admin"],
            children:[
                {
                    label:"关于",
                    key:"/test/home",
                    roles:["admin"],
                    component:<About/>,
                }
            ]
        },
        {
            label:"测试1",
            key:"/test1",
            roles:["admin"],
            children:[
                {
                    label:"关于1",
                    key:"/test1/home1",
                    roles:["admin"],
                    component:<About/>,
                }
            ]
        },
        {
            label:"测试2",
            key:"/test2",
            roles:["user"],
            component:<Test/>
        },
    ],
    pages:[
        {
            label:"登录",
            key:"/login",
            component:lazy(()=>import('../views/login'))
        },
        {
            label:"驾驶舱",
            key:"/cockpit",
            component:lazy(()=>import('../views/cockpit'))
        },
        {
            label:"404",
            key:"/404",
            component:lazy(()=>import('../views/NotFound'))
        },
    ]
}

export default routes