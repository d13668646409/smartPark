

import React,{ lazy, Suspense } from 'react';
import { HashRouter,Route,Routes,Navigate,useNavigate } from "react-router-dom";
import { ConfigProvider } from 'antd';
import { getRolesRoute,_splitArr } from '@/utils/utils'
import AuthRoute from "@/routes/AutoRouter.tsx"
import route from '@/routes'
import BasicLayout from '@/layouts/BasicLayout'

const Login = lazy(() => import('@/views/login'));
const Cockpit = lazy(() => import('@/views/cockpit'));
const NotFound = lazy(() => import('@/views/NotFound'));
const Loading = lazy(() => import('@/components/common/loadingPage'));


  const getRouteData = (items)=>{
    let _items = getRolesRoute(items)
    return _items.map(r => {
      if (r.children && r.children.length > 0) {
        return (<Route index={r.key == '/'} key={r.key} element={r.component}>
          {getRouteData(r.children)}
        </Route>)
      }
  
      return (<Route index={r.key == '/'} key={r.key} path={r.key} element={<AuthRoute>{r.component}</AuthRoute>}></Route>)
    })
  }

const Router =()=>{
  const navigate = useNavigate()
  return(
    <Routes>
      <Route path='/login' element={<Login navigate={navigate} />}/>
      <Route path='/cockpit' element={<Cockpit navigate={navigate} />}/>
      <Route path='/404' element={<NotFound />}/>
      <Route path='/' element={<BasicLayout navigate={navigate}/>}>
        {getRouteData([...route.sideNav,...route.pages])}
      </Route>
      <Route path="*" element={<Navigate to="/"/>} />
    </Routes>
  )
}

const App = () => {
  return <ConfigProvider>
    <HashRouter>
      <Suspense fallback={<Loading />}>
        {/* <AuthRoute> */}
          <Router />
        {/* </AuthRoute> */}
      </Suspense>
    </HashRouter>
</ConfigProvider>
}

export default App;
