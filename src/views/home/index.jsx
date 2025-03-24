import React,{useEffect} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { loadStart, loadEnd } from '@/reducers/globalReducer';
import { useNavigate } from "react-router-dom";
import style from './index.module.scss'
import SearchFactor from "./searchForm";
import {Table} from '@/components'


const  Home = (props) =>{
    const loadingShow = useSelector((state) => state.global.loadingShow); // 获取counter状态
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const handleIncrement = () => {
      dispatch(loadStart()); // 分发increment action
    };
  
    const handleDecrement = () => {
      dispatch(loadEnd()); // 分发decrement action
    };

    const goTest=()=>{
      console.log(props)
      navigate('/test/home')
    }
    useEffect(()=>{

    },[])
    return (
      <div className={style.homePage}>
        <div className={style.search}>
          <SearchFactor
          />
        </div>
        <Table />
      </div>
    );
  }

  export default Home