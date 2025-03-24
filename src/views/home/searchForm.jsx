import React, { useState } from 'react'
import {SearchContainer,SearchItem} from '@/components'
import { handlerValue } from '@/utils/validate'
import style from './index.module.scss'
import { defaultSelectOptions} from '@/utils/validate'

const SearchFactor = (props) => {
  const [disabledStatus, setDisabledStatus] = useState({}) //自定义回调对象
  const [danceLevel, setDanceLevel] = useState([]) //自定义回调对象
  const [examsore, setExamsore] = useState(defaultSelectOptions.examSoreT) //自定义回调对象 searchType_
  const [searchType_, setSearchType_] = useState(defaultSelectOptions.searchType_) //自定义回调对象 
  const searchFactor = (_data) => {
    /**
     * @description: 个体实例自定义回调函数
     */ 
     const mainCallback = async () => {
        console.log("2")
      let danceId = _data.getFieldValue('danceType')
      if(danceId){
        disabledStatus['level'].setSelectDisabled(false)
        const resetOptions = await disabledStatus['level']
          .getOptionsList('getDanceLevelOptions', {danceId})
        setDanceLevel(resetOptions)
        _data.resetFields(['level'])
      } else disabledStatus['level'].setSelectDisabled(true)
    }
    const reSetStatus = (callback) => {
      let _set = Object.assign(disabledStatus,callback)
      setDisabledStatus(_set)
    }
    
    let searchInfo = [
      { type: 'select', label: '课程类型', variables: 'danceType', keys: 'select_danceType', 
        options: 'danceType', optionsApi: 'getCourseType', callback: ()=>{},
        // callback: mainCallback,
        // callbackType: 'setSelectDisabled'
      },
      { type: 'select', label: '考试级别', variables: 'level', keys: 'select_level',
        options: danceLevel, callback: ()=>{}, optionSave: false,placeholder: '请先选择考试舞种',
        callbackType: ['setSelectDisabled','getOptionsList']
      },
      { type: 'select', label: '证书成绩', variables: 'achievement', keys: 'select_sore',callback: ()=>{},
        options:examsore, 
      },
      {
        type: 'inputGroup', label: '考生搜索', variables: 'context', keys: 'select_value3', options: searchType_, value: ['2',null],
        placeholder: '输入编号、身份证', iconFont:[true],marginRight:0, flexGrow: 0, colSpan: 3.88
      },
      
    ]
    return searchInfo.map((item,index) => {
      let keys = item?.keys??index
      return (
        <SearchItem {...item} {..._data} keyIndex={index} key={keys} reSetParentEvent={reSetStatus}  />
      )
    })
  }
  /**
   * @description: 
   * @param {*} _type 【String: 传参类型 getValue】
   * @param {*} _value  【Object：参数对象】
   * @return {*}
   */  
  const handlerValueFun = (_type,_value) => {
    if(_value.printStatus=='3') _value.printStatus=''
    let ig=_value.context
    let id=_value.examId
    _value.context=ig[1]
    _value['searchType']=ig[0]
    id && (id.length==4?_value.examId=id[id.length-1]:_value.examId='')
    const value = handlerValue(_type,_value)
    props.getValue(value)
  }
  const setDisabledFun = () =>{
    disabledStatus['examId'].setSelectDisabled(true)
    disabledStatus['level'].setSelectDisabled(true)
  }
  return (
    <div className={style.container}>
      <SearchContainer setDisabledFun={setDisabledFun} handlerValue={handlerValueFun} render={searchFactor}   />
    </div>
  )
}
export default SearchFactor