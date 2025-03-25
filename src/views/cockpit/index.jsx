import React,{useEffect} from "react";
import { loadStart, loadEnd } from '@/reducers/globalReducer';
import style from './index.module.scss'

const cockpitPage = (props)=>{

  return(
    <div className={style.cockpitPage}>
      驾驶舱
    </div>
  )
}

export default cockpitPage