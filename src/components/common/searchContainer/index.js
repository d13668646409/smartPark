import React, { useEffect, useState, useContext } from 'react';
import { Form, Button } from 'antd'
import style from './index.module.scss'
import { MyContext } from '@/utils/validate';
import { tableDefaultConfig } from '@/utils/validate'
/**
 * @description: 
 * @param {*} props
 * @param {*} oprationSide【String：操作项对齐方式 position/最右侧 flex/跟随】
 * @param {*} handlerValue【Function：获取Form表单值的回调(type, value)】
 * @param {*} oprationSide【String：操作项定位方式 flex/position】
 * @return {*}
 */
const SearchContainer = (props) => {
  const { oprationSide='position', handlerValue, handlerSearchValue } = props
  
  const [form] = Form.useForm()
  const [dateTimeSet,setDateTimeSet] = useState({})
  const [defaultValueTmp,setDefaultValueTmp] = useState({}) //默认查询条件
  const MyContextObj = useContext(MyContext)
  let loadingStatus = false, dispatch = ()=>{}, defaultValue = {}
  if(MyContextObj?.dispatch) {
    loadingStatus = MyContextObj.loadingStatus
    dispatch = MyContextObj.dispatch
  }
  // 保存默认查询条件
  const resetSearch = (value) => {
    let _defaultValueTmp = { ...defaultValue, ...value }
    defaultValue = _defaultValueTmp
    setDefaultValueTmp(_defaultValueTmp)
  }
  // 查询条件结果
  const searchResult = async (type='getValue') => {
    dispatch({ type: 'start' })
    form.validateFields().then(searchFactor => {
      Object.keys(searchFactor).includes('*') && delete searchFactor['*']
      // Object.keys(searchFactor).map(key => searchFactor[key] === undefined && (searchFactor[key] = null))
      searchFactor = Object.assign(searchFactor,tableDefaultConfig)
      if(type === 'getValue') handlerValue(type,searchFactor)
        else if(type === 'getSearch') handlerSearchValue(searchFactor)
    }).catch(err => dispatch({ type: 'end' }))
  }
  
  // 重置查询条件
  const resetResult = () => {
    form.resetFields()
    form.setFieldsValue(defaultValueTmp)
    Object.keys(dateTimeSet).map(key => dateTimeSet[key]())
    searchResult()
    setDisabled()
  }
  const setDisabled = () =>{
    props.setDisabledFun()
  }
  
  const reSetDate = (callback) => {
    let _set = Object.assign(dateTimeSet,callback)
    setDateTimeSet(_set)
  }
  useEffect(()=>{
    searchResult()
  },[]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={style.searchContainerBox}>
      <Form form={form} name="search-container" className={style.searchForm}>
        { props.render({...form,reSetDate,resetSearch}) }
        <Form.Item wrapperCol={{span: 24}}
          className={`${oprationSide==='position'?style.oprationBtnPosi:style.oprationBtnBottom}`}>
          <div className={style.oprationBtn}>
            <Button onClick={()=> searchResult('getValue')} className={style.confirm} 
            // loading={loadingStatus}
            >查询</Button>
            <Button  onClick={resetResult} className="resetBtnStyle">重置</Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}

export default SearchContainer