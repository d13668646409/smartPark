import React, { useEffect, useState, useCallback } from 'react';
import { Form, Input, DatePicker, Radio, Select, TreeSelect, Cascader, Tooltip, Checkbox, Divider, Spin } from 'antd'
import moment from 'moment'
import style from './index.module.scss';
import searchImg from '@/asstes/images/search.png'
import { modulesConfig, getModulesConfig, recursionArrayDiff, recursionArray_Tree, isArray } from '@/utils/utils'
// import { searchRight } from '@/scss/_variables.scss'
import api from '@/actions'

const { Option } = Select
const { SHOW_PARENT,SHOW_ALL } = TreeSelect
const { TextArea } = Input
const { RangePicker } = DatePicker
/**
 * @description: 
 * @param {*} props
 * @param {*} type【String：input/numeric/textArea/select/sigleDate/rangeDate/radio/cascader/cascaderLazy/selectTree/occupy--占位】
 * @param {*} label【String：左输入框label信息】
 * @param {*} page
 * @param {*} colSpan【Number：1~10 占据宽度】
 * @param {*} flexGrow【Number：0~1 布局是否均分剩余空间】
 * @param {*} marginRight【Number： 右外边距】
 * @param {*} variables【String：参数】当type==occupy时需为 "*"
 * @param {*} rules【Array：校验规则】
 * @param {*} placeholder【String：占位字符】
 * @param {*} isEdit【Boolean：是否编辑状态】
 * @param {*} isNoValue【Boolean：是否可为空】
 * @param {*} iconFont【Array: left/right】
 * @param {*} isEcho【Boolean: 是否有回显信息】
 * @param {*} isEchoText【String: 回显信息】
 * @param {*} callback【Function: 个体实例自定义回调函数】
 * @param {*} reSetParentEvent【Function: 自定义方法集合函数】向调用组件传递集合方法
 * @param {*} callbackType【String: 自定义方法类型】custom(调用组件自定义)/[type](自身组件自定义)
 * @param {*} reSetDate【Function: 重置数据回调】
 * @param {*} optionsApi【String: 为获取常量列表的查询API】type==cascaderLazy时可为Array, 动态调用多个接口
 * @param {*} optionApiParams【Object: 为获取常量列表的查询API所需的参数对象】type==cascaderLazy时可为Array, 为多个接口提供参数
 * @param {*} optionSave【Boolean: 获取到的常量是否存储到常量表中, 默认为true】
 * @param {*} extraParamsValita【String: 指定判断额外参数字段】
 * @param {type==[select,cascader,selectTree]} options【String：当type==[select,cascader,selectTree]时的下拉选项，
 *  存储位置为/utils/utils.modulesConfig】
 *  当type==select为模糊查询时需为 "fuzzy", 当type==selectTree且为多选时，options会拼接"_more"
 * @param {*} searchApi【String: 搜索查询API】
 * @param {*} searchLabelField【String: 搜索下拉框label属性】
 * @param {*} searchValueField【String: 搜索下拉框value属性】
 * @param {*} placeholderModuleSelect:【String: 选择框模式选择占位字符】
 * @param {*} placeholderCascader:【String: 级联选择框占位字符】
 */
const SearchItem = (props) => {
  const { type, value, label, variables = "default", rules = [], placeholder, isEdit = true,
    isNoValue = false, iconFont, colSpan,marginRight, flexGrow = 1, reSetDate, reSetParentEvent, optionsApi = '',
    callback, callbackType = 'custom', isEcho = false, options = "", optionApiParams = {}, optionSave = true,
    isEchoText = "", extraParamsValita = '', page,  searchLabelField, searchValueField,placeholderModuleSelect,placeholderCascader } = props
  const _placeholder = () => {
    if( type == "cascaderGroup"){
      let text = selectDisabled?placeholder:selectModule==1?placeholderModuleSelect:placeholderCascader
      return text
    }
    if (placeholder) return placeholder
    if (['select', 'sigleDate', 'cascaderLazy'].includes(type)) return `请选择${label}`
    else if (type === 'rangeDate') return ['开始时间', '结束时间']
    else return `请输入${label}`
  }
  // 默认时间区间
  const [rangeDate, setRangeDate] = useState(['', ''])  //选中的联级时间
  const [rangeDateObj, setRangeDateObj] = useState([null, null])  //选中的联级时间对象
  const [optionsArr, setOptionsArr] = useState([]) //下拉选项
  const [selectConfig, setSelectConfig] = useState({}) //下拉选项
  const [selectDisabled, setSelectDisabled] = useState(props?.disabled ?? false) //下拉是否禁用
  const [timePickerType, setTimePickerType] = useState('YYYY-MM-DD') //时间选择类型，默认'YYYY/MM/DD'
  const [numericValue, setNumericValue] = useState() //指定数字
  const [inputGroupData, setInputGroupData] = useState(value) //限定type==inputGroup时使用
  const [extraParams, setExtraParams] = useState({}) //配置额外参数
  const [itemValue, setItemValue] = useState(props?.value) //默认值
  const [searchOptions, setSearchOptions] = useState([])//搜索下拉项
  const [loadMoreDropdown, setLoadMoreDropdown] = useState(false)//下拉扩展菜单加载更多是否显示
  const [dropdownLoading, setDropdownLoading] = useState(false)//下拉扩展菜单加载更多是否显示loading
  const [selectModule, setSelectModule] = useState(1)//考场选择模式
  /**
   * @description: 获取日期选中
   * @param {*} moment 选中的日期对象
   * @param {*} string  选中的日期字符串
   * @return {*}
   */
  const onChangeDate = (moment, string) => {
    let dateTime, dateObjs = []
    if (type === 'rangeDate') {
      dateTime = string
      dateObjs = moment
    } else if (type === 'sigleDate') {
      dateTime = string
      dateObjs[0] = moment
    }
    setRangeDate(dateTime)
    setRangeDateObj(dateObjs)
    props.setFieldsValue({ [variables]: dateTime })
    callback && callback({ [variables]: dateTime })
  }
  /**
   * @description: 金额输入框数据
   * @param {*} value 输入的金额数据
   * @return {*}
   */
  const onChangeNumeric = (value) => {
    const reg = /^-?\d*(\.\d*)?$/, validateV = String(value)
    if ((!isNaN(value) && reg.test(validateV)) || value === '' || value === '-') {
      if (validateV.split('.').length > 1) {
        if (validateV.split('.')[1].length > 4) return
      }
      if (value[0] == '0') value = Number(value)
      setNumericValue(value)
      props.setFieldsValue({ [variables]: value })
      callback && callback({ [variables]: value })
    }
  }
  const transferTimeDate = (type) => {
    setRangeDate(['', ''])
    setRangeDateObj([null, null])
    setTimePickerType(type)
  }
  const setSelectOptionsType = async (option) => {
    let mockDefaultSearch = await getOptionsList(optionsApi, option)
    // 将存储位置列表赋值到列表
    let optionsData = mockDefaultSearch.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)
    isNoValue && optionsData.push(<Option key={''} value={''}>无</Option>)
    setOptionsArr(optionsData)
  }
  /**
   * @description: 获取下拉框选项值
   * @param {*} _api api接口
   * @param {*} params 暴露方式时, 传参参数
   * @param {*} type 请求操作类型
   * @return {*}
   */
  const getOptionsList = (_api, params = optionApiParams, _option = options) => {
    return new Promise(async resolve => {
      let resultCode = modulesConfig?.[_option] ?? []
      if (resultCode.length > 0 && optionSave) resolve(resultCode)
      else if (_api) {
        if (type == 'select') {
          let result = await api[_api](params)
          if (result?.data && result.data.length > 0) {
            result.data.map(item =>
              resultCode.push({ label: item.typeName, value: item.id, id: item.id }))
            optionSave && getModulesConfig(_option, resultCode)
            resolve(resultCode)
          }
        } else if (type == 'inputGroup') {
          console.log(api,_api,params)
          let result = await api[_api](params)
          if (result?.data && result.data.length > 0) {
            result.data.map(item =>
              resultCode.push({ label: item.label, value: item.number, id: item.number }))
            optionSave && getModulesConfig(_option, resultCode)
            resolve(resultCode)
          }
        }
        else if (type == 'selectTree') {
          let splitOptions = _option.split('_'), _arr = []
          let result = await api[_api]()
          if (result?.data) {
            console.log(result)
            splitOptions.length > 1 && (_arr = recursionArray_Tree(result?.data))
            splitOptions.length == 1 && (_arr = result?.data)
          }
          optionSave && getModulesConfig(_option, _arr)
          resolve(_arr)
        } else if (type == 'cascaderLazy'|| type == "cascaderGroup") {
          let result = await api[_api](params)
          if (result?.data) {
            const isLeaf = optionsApi[optionsApi.length - 1] == _api ? {} : { isLeaf: false }
            const index = optionsApi.findIndex(_i => _i == _api)
            result.data.map(item =>
              resultCode.push({
                label: item.label, value: item.number, index,
                id: item.number, ...isLeaf
              }))
          }
          optionSave && getModulesConfig(_option, resultCode)
          resolve(resultCode)
        } else if (type == 'cascader') {
          let result = await api[_api]()
          if (result?.data && result.data.length > 0) {
            result.data.map(item =>
              resultCode.push({ label: item.label, value: item.number, id: item.number }))
          }
          optionSave && getModulesConfig(_option, resultCode)
          resolve(resultCode)
        } else if (type == 'radio') {
          let result = await api[_api]()
          if (result?.data && result.data.length > 0) {
            result.data.map(item =>
              resultCode.push({ label: item.label, value: item.number, id: item.number }))
          }
          optionSave && getModulesConfig(_option, resultCode)
          resolve(resultCode)
        }
      }
    })
  }
  /**
   * @description: 类型判断处理
   * @param {*} 
   * @return {*} 
   */
  const switchMap = useCallback(async () => {
    let optionsData = [], // radio/select/cascader的选项
      mockDefaultSearch = [],
      callbackFun = {
        setSelectDisabled, transferTimeDate, setSelectOptionsType, setExtraParams,
        setItemValue, setNumericValue, handleChangeValue, getOptionsList
      }
    // 自定义回调函数
    if (reSetParentEvent && callback) {
      if (typeof callbackType == 'string')
        reSetParentEvent({ [variables]: callbackType === 'custom' ? callback : callbackFun[callbackType] })
      else {
        let _callbackF = {}
        callbackType.map(_call => _callbackF[_call] = callbackFun[_call])
        reSetParentEvent({ [variables]: _callbackF })
      }
    }
    reSetDate && reSetDate({ [variables]: reSetItemValue })
    switch (type) {
      case 'sigleDate':
        if (value) {
          let dateObj = [moment(value || timePickerType)]
          setRangeDate(value)
          setRangeDateObj(dateObj)
        }
        break;
      case 'rangeDate':
        if (Array.isArray(value) && value.length > 0) {
          let dateObj = [moment(value[0] || timePickerType), moment(value[1] || timePickerType)]
          setRangeDate(value)
          setRangeDateObj(dateObj)
        }
        break;
      case 'select':
        if (options !== 'fuzzy') {
          mockDefaultSearch = await getOptionsList(optionsApi)
          // 将存储位置列表赋值到列表
          optionsData = mockDefaultSearch.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)
        } else setSelectConfig({ showSearch: true, onSearch: handleSearch, filterOption: false, allowClear: true })
        isNoValue && optionsData.push(<Option key={''} value={''}>无</Option>)
        if (options.split('_')[1] === 'more') setSelectConfig({ mode: 'multiple', allowClear: true })
        setOptionsArr(optionsData)
        break;
      case 'inputGroup':
        if (options !== 'fuzzy') {
          mockDefaultSearch = await getOptionsList(optionsApi)
          // 将存储位置列表赋值到列表
          optionsData = mockDefaultSearch.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)
        } else setSelectConfig({ showSearch: true, onSearch: handleSearch, filterOption: false, allowClear: true })
        isNoValue && optionsData.push(<Option key={''} value={''}>无</Option>)
        if (options.split('_')[1] === 'more') setSelectConfig({ mode: 'multiple', allowClear: true })
        console.log(value)
        setOptionsArr(optionsData)
        setInputGroupData(value)
        break;
      case 'radio':
        mockDefaultSearch = await getOptionsList(optionsApi)
        optionsData = mockDefaultSearch.map(item =>
          <Radio key={item.value} value={item.value}>{item.label}</Radio>
        )
        setOptionsArr(optionsData)
        break;
      case 'numeric':
        onChangeNumeric(value)
        break;
      case 'cascader':
        mockDefaultSearch = await getOptionsList(optionsApi)
        setOptionsArr(mockDefaultSearch)
        break;
      case 'selectTree':
        mockDefaultSearch = await getOptionsList(optionsApi)
        setOptionsArr(mockDefaultSearch)
        break;
      case 'cascaderLazy':
        const floorFirst = isArray(optionsApi) ? optionsApi[0] : optionsApi
        const paramsFirst = isArray(optionApiParams) ? optionApiParams[0] : optionApiParams
        mockDefaultSearch = await getOptionsList(floorFirst, paramsFirst)
        setOptionsArr(mockDefaultSearch)
        break;
      case 'cascaderGroup':
        let cascaderFloorFirst = isArray(optionsApi) ? optionsApi[0] : optionsApi
        const cascaderParamsFirst = isArray(optionApiParams) ? optionApiParams[0] : optionApiParams
        mockDefaultSearch = await getOptionsList(cascaderFloorFirst, cascaderParamsFirst)
        setOptionsArr(mockDefaultSearch)
        break;
      default:
        break;
    }
  }, [value, type, reSetDate, variables, options, callback]) // eslint-disable-line react-hooks/exhaustive-deps
  /**
   * @description: 组件更新列表 
   * 适用于select/selectTree/cascader/radio
   * @param {*} reOptions 要更新的列表项
   */
  const resetOptions = (reOptions = []) => {
    let resetOptionsData = []
    switch (type) {
      case 'select':
        resetOptionsData = reOptions.map(item =>
          <Option key={item.value} value={item.value}>{item.label}</Option>)
        break
      case 'inputGroup':
        resetOptionsData = reOptions.map(item =>
          <Option key={item.value} value={item.value}>{item.label}</Option>)
        break
      case 'radio':
        resetOptionsData = reOptions.map(item =>
          <Radio key={item.value} value={item.value}>{item.label}</Radio>)
        break
      case 'cascader':
        resetOptionsData = reOptions
        break
      case 'selectTree':
        resetOptionsData = reOptions
        break
      default:
        break
    }
    setOptionsArr(resetOptionsData)
  }
  /**
   * @description: 选中信息
   * @param {*} value 选中值
   * @param {*} label 选中的值对应文字
   * @param {type == selectTree} extra 选中的实例对象
   * @return {*}
   */
  const handleChangeValue = (value, label, extra) => {
    let keyValue = {}
    if (type === 'selectTree') {
      keyValue = { [variables]: value }
      props.setFieldsValue(keyValue)
      callback && callback(keyValue)
    } else if (type === 'select') {
      props.setFieldsValue({ [variables]: value })
      label && callback && callback({ [variables]: label })
    } else if (type === 'inputGroup') {
      if (label == 'select') {
        if (value !== inputGroupData[0]) setInputGroupData([value, null])
      } else if (label == 'input') {
        const _d = [inputGroupData[0], value]
        props.setFieldsValue({ [variables]: _d })
        setInputGroupData([inputGroupData[0], value])
      }
    }
    else if (type === 'cascaderLazy') {
      keyValue = { [variables]: value }
      props.setFieldsValue(keyValue)
      callback && callback(keyValue)
    } else {
      keyValue = { [variables]: value }
      props.setFieldsValue(keyValue)
      callback && callback(keyValue)
    }
    setItemValue(value)
  }
  /**
   * @description: select模糊查询条件
   * @param {*} value 输入信息值
   * @return {*} 
   */
  let timeoutFuzzySearch, currentValueFuzzySearch
  const handleSearchResult = (value, callback) => {
    if (timeoutFuzzySearch) {
      clearTimeout(timeoutFuzzySearch)
      currentValueFuzzySearch = null
    }
    currentValueFuzzySearch = value
    const fuzzySearch = async () => {
      let result = await api[optionsApi]({ ...optionApiParams, [optionApiParams[variables]]: value }), optionsData = []
      if (result?.data && result?.data?.length > 0) {
        optionsData = result.data.map(item =>
          <Option key={item.value} value={item.value} item={item}>{item.label}</Option>)
      }
      callback(optionsData)
    }
    timeoutFuzzySearch = setTimeout(fuzzySearch, 800)
  }
  /**
   * @description: cascaderLazy动态加载数据项
   * @param {*}  selectedOptions 选中的当前项
   * @return {*}
   */
  const loadDataLazy = async selectedOptions => {
    const target = selectedOptions[selectedOptions.length - 1]
    let _extraParams = {}
    target.loading = true
    if(optionApiParams[target.index + 1].key == extraParamsValita){
      _extraParams = extraParams
    }
    const params = {
      ...optionApiParams[target.index + 1], ..._extraParams,
      [optionApiParams[target.index + 1].key]: target.value
    }
    delete params.key
    const resultChildren = await getOptionsList(optionsApi[target.index + 1], params)
    target.loading = false
    target.children = resultChildren
    setOptionsArr([...optionsArr])
  }
  
  const onSearch = (v) => {
    // console.log(e);
    // console.log(e.target.value);
    // if (e.keyCode == 13 && e.target.value) {
    if (v) {
      setSearchOptions([])
      // let v = e.target.value;
      optionsSearch(v, true)
    }
  }
  const onChangeSelectExam = (value) => {
    let arr = ['','','',value+""]
    let keyValue = { [variables]: arr }
    props.setFieldsValue(keyValue)
    callback && callback(keyValue)
  }
   /**
   * @description: 选择模式change
   * @param {*} 
   * @return {*} 
   */
  const changeSelectModule = (v) =>{
    setSelectModule(v)
  }
  const getSearchOptionsList = (_api, params = optionApiParams, reset) => {
    return new Promise(async resolve => {
      if (_api) {
        let resultCode = reset ? [] : searchOptions;
        let result = await api[_api](params)
        result.data?.data.map(item =>
          resultCode.push({
            label: item[searchLabelField], value: item[searchValueField],
            id: item[searchValueField],
          }))
        // if (resultCode.length < result.data.total) {
        //   setLoadMoreDropdown(true)
        // } else {
        //   setLoadMoreDropdown(false)
        // }
        resolve(resultCode)
      }
    })
  }
  const optionsSearch = async (v, reset) => {
    let obj = optionApiParams[optionApiParams.length-1]
    let examType = props.examSelectModule == "search"?extraParams.examType:obj?.examType
    let params = {
      current: 1,
      identityType: examType,//1学生 2老师
      queryString: v,
      size: 50
    }
    let res = await getSearchOptionsList(props.searchApi, params, reset)
    setSearchOptions(res);
  }
  const handleSearch = (value = '') => {
    handleSearchResult(value, data => setOptionsArr(data))
  }
  // From Item 样式
  const styleObj = () => {
    let style = { flexGrow }, _right = Number("15px".split('px')[0])
    if (colSpan) style.width = `calc(${colSpan * 10}% - ${_right - _right / 4}px)`
    else style.width = `calc(25% - ${_right - _right / 4}px)`
    if(marginRight||marginRight==0) style.marginRight=`${marginRight}px`
    return style
  }
  /**
   * @description: 重置数据到原始数据
   * @param {*}
   * @return {*}
   */
  const reSetItemValue = () => {
    if (type == 'numeric') setNumericValue(value)
    else if (type == 'sigleDate') {
      let _rangDO = [null, null]
      if (value) _rangDO = [moment(value || timePickerType)]
      setRangeDate(value)
      setRangeDateObj(_rangDO)
    } else if (type == 'rangeDate') {
      let _rangD = ['', ''], _rangDO = [null, null]
      if (Array.isArray(value) && value.length > 0) {
        _rangD = value
        _rangDO = [moment(value[0] || timePickerType), moment(value[1] || timePickerType)]
      }
      setRangeDate(value)
      setRangeDateObj(_rangDO)
    }else if(type === 'inputGroup'){
      setInputGroupData(value)
    } 
     else setItemValue(value)
  }
  /**
   * @description: 显示默认及改动信息--查看详情
   * @param {*}
   * @return {*}
   */
  const showDefaultEchoText = () => {
    return (isEcho && isEchoText ? <Tooltip placement="topLeft" title={`原数据：${isEchoText}`}>
      <span className={style.editTextStyle}>{value}</span>
    </Tooltip> :
      <div className={isEcho && !isEchoText ? style.echoTextStyle : style.defaultTextStyle}>{value}</div>)
  }
  /**
   * @description: 渲染node实例
   * @param {*} type 实例类型 类型如@param type
   * @return {*}
   */
  const rederNodeExample = (type) => {
    // const randomString = new Date().getTime()+variables
    switch (type) {
      case 'textArea':
        return (<>
          {isEdit
            ? <TextArea value={itemValue ?? ''} placeholder={_placeholder()} disabled={selectDisabled} allowClear
              onChange={(event) => handleChangeValue(event.target.value)}
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
            : showDefaultEchoText()}
        </>)
      case 'input':
        return (<>
          {isEdit
            ? <Input placeholder={_placeholder()} value={itemValue ?? value ?? ''} disabled={selectDisabled} allowClear
              onChange={(event) => handleChangeValue(event.target.value)}
              prefix={iconFont?.[0] ? <img src={searchImg} className={style.searchIcon} alt="" /> : null} />
            : showDefaultEchoText()}
        </>)
      case 'numeric':
        return (<>
          {isEdit
            ? <Input placeholder={_placeholder()} value={numericValue ?? 0} disabled={selectDisabled} allowClear
              onChange={(event) => onChangeNumeric(event.target.value)} />
            : showDefaultEchoText()}
        </>)
      case 'inputGroup':
        let valueText_select_i = value, _value_i = inputGroupData?.[0] ?? value[0]
        if (modulesConfig?.[options]) {
          modulesConfig[options].map(item => {
            if (item.value == value) valueText_select_i = item.label
            return true
          })
        }
        // console.log(inputGroupData,_value_i)
        return (<>
          {isEdit
            ? <Input.Group compact>
              <Select value={_value_i} placeholder={_placeholder()} {...selectConfig} 
                disabled={selectDisabled} onChange={(event) => handleChangeValue(event, 'select')}
                getPopupContainer={triggerNode => triggerNode.parentNode}>
                {optionsArr}
              </Select>
              <Input placeholder={_placeholder()} value={inputGroupData?.[1] ?? ''} disabled={selectDisabled} allowClear
                onChange={(event) => handleChangeValue(event.target.value, 'input')}
                prefix={iconFont?.[0] ? <img src={searchImg} className={style.searchIcon} alt="" /> : null} />
            </Input.Group>
            : showDefaultEchoText()}
        </>)
      case 'sigleDate':
        return (<>
          {isEdit
            ? <DatePicker onChange={(m, s) => { onChangeDate(m, s) }} disabled={selectDisabled} allowClear
              style={{ width: '100%' }} showToday={false} value={rangeDateObj[0]}
              getPopupContainer={triggerNode => triggerNode.parentNode} />
            : showDefaultEchoText()}
        </>)
      case 'rangeDate':
        const rangePickerConfig = rangeDate?.[0] ? {
          value: [moment(rangeDate[0], timePickerType), moment(rangeDate[1], timePickerType)]
        } : {}
        return (<div className={style.searchFormRange}>
          {isEdit
            ? <RangePicker format={timePickerType} {...rangePickerConfig} placeholder={_placeholder()} allowClear
              onChange={(m, s) => { onChangeDate(m, s) }} disabled={selectDisabled}
              getPopupContainer={triggerNode => triggerNode.parentNode} />
            : showDefaultEchoText()}
        </div>)
      case 'select':
        let valueText_select = value, _value = value
        if (modulesConfig?.[options]) {
          modulesConfig[options].map(item => {
            if (item.value == value) valueText_select = item.label
            return true
          })
        }
        if (itemValue) {
          if (selectConfig.mode !== 'multiple') {
            if (modulesConfig?.[options]) {
              typeof modulesConfig[options][0].value == 'number' && (_value = Number(itemValue))
              typeof modulesConfig[options][0].value == 'string' && (_value = String(itemValue))
            } else {
              typeof _value == 'number' && (_value = Number(itemValue))
              typeof _value == 'string' && (_value = String(itemValue))
            }
          } else _value = itemValue
        } else selectConfig.mode == 'multiple' && (_value = [])
        return (<>
          {isEdit
            ? <Select value={_value} placeholder={_placeholder()} {...selectConfig} allowClear
              disabled={selectDisabled} onChange={handleChangeValue}
              getPopupContainer={triggerNode => triggerNode.parentNode}>
              {optionsArr}
            </Select>
            : (isEcho && isEchoText ? <Tooltip placement="topLeft" title={`原数据：${isEchoText}`}>
              <span className={style.editTextStyle}>{valueText_select}</span>
            </Tooltip> :
              <div className={isEcho && !isEchoText ? style.echoTextStyle : style.defaultTextStyle}>{valueText_select}</div>)}
        </>)
      case 'radio':
        let valueText_radio = value
        modulesConfig?.[options] && modulesConfig[options].map(item => {
          if (item.value == value) valueText_radio = item.label
          return true
        })
        return (<>
          {isEdit
            ? <Radio.Group value={itemValue} disabled={selectDisabled}
              onChange={(event) => handleChangeValue(event.target.value)}>
              {optionsArr}
            </Radio.Group>
            : (isEcho && isEchoText ? <Tooltip placement="topLeft" title={`原数据：${isEchoText}`}>
              <span className={style.editTextStyle}>{valueText_radio}</span>
            </Tooltip> :
              <div className={isEcho && !isEchoText ? style.echoTextStyle : style.defaultTextStyle}>{valueText_radio}</div>)}
        </>)
      case 'cascader':
        let valueText_cascader = '', valueTextArray = []
        modulesConfig?.[options] && (valueTextArray = recursionArrayDiff(modulesConfig[options], value, 'value', 'label'))
        valueText_cascader = Array.isArray(valueTextArray)
          && valueTextArray.map((item, index) => item + (index < value.length - 1 ? ' / ' : ''))
        return (<>
          {isEdit
            ? <Cascader defaultValue={value} options={optionsArr} onChange={handleChangeValue} allowClear
              disabled={selectDisabled} getPopupContainer={triggerNode => triggerNode.parentNode} />
            : (isEcho && isEchoText ? <Tooltip placement="topLeft" title={`原数据：${isEchoText}`}>
              <span className={style.editTextStyle}>{valueText_cascader}</span>
            </Tooltip> :
              <div className={isEcho && !isEchoText ? style.echoTextStyle : style.defaultTextStyle}>{valueText_cascader}</div>)}
        </>)
      case 'cascaderGroup':
        return (<>
          {isEdit
            ? <Input.Group compact>
              <Select style={{width:70,zIndex:'10'}} value={selectModule} placeholder={"请选择"} 
                disabled={selectDisabled} 
                onChange={changeSelectModule}
                getPopupContainer={triggerNode => triggerNode.parentNode}>
               <Option key={1} value={1}>搜索模式</Option>
               <Option key={2} value={2}>级联选择模式</Option>
              </Select>
              <>
                {
                  selectModule==1 ?
                    <Select
                      showSearch
                      style={{width:300}}
                      placeholder={_placeholder()}
                      defaultActiveFirstOption={false}
                      showArrow={false}
                      filterOption={false}
                      onSearch={onSearch}
                      onChange={onChangeSelectExam}
                      notFoundContent={null}
                      disabled={selectDisabled}
                      options={searchOptions}
                    >
                    </Select>:
                    <Cascader
                    style={{width:300}}
                    defaultValue={value} loadData={()=>loadDataLazy()} options={optionsArr}
                    changeOnSelect={false} allowClear
                    placeholder={_placeholder()} onChange={handleChangeValue} disabled={selectDisabled}
                    displayRender={page ? (label, selectedOptions) => {
                      if (selectedOptions.length == 4) return label.join('/')
                      else if (selectedOptions.length >= 1 && selectedOptions.length <= 3) return '请选择正确的考场'
                      else return
                    } : (label) => { return label.join('/') }}
                    getPopupContainer={triggerNode => triggerNode.parentNode} /> 
                }
              </>

            </Input.Group>
            : showDefaultEchoText()}
        </>)
      case 'cascaderLazy':
        return (<>
          {isEdit
            ? <Cascader defaultValue={value} loadData={()=>loadDataLazy()} options={optionsArr} changeOnSelect={false} allowClear
              placeholder={_placeholder()} onChange={handleChangeValue} disabled={selectDisabled}
              displayRender={page?(label, selectedOptions) => {
                if(selectedOptions.length==4) return label.join('/')
                else if(selectedOptions.length>=1&&selectedOptions.length<=3) return '请选择正确的考场'
                else return 
              }:(label)=>{return label.join('/')}}
              getPopupContainer={triggerNode => triggerNode.parentNode} />
            : (null)
          }
        </>)
      // case 'cascaderLazy':
      //   // console.log(page)
      //   return (<>
      //     {isEdit ?
      //       <Cascader showSearch={filter}
      //         // onKeyDown={onSearch} 
      //         onClear={onClearInputText}
      //         dropdownRender={cascaderLazySearch && loadMoreDropdown ? dropdownCascaderLazy : null}
      //         defaultValue={value} loadData={loadDataLazy} options={cascaderLazySearch ? searchOptions : optionsArr}
      //         changeOnSelect={false} allowClear
      //         placeholder={_placeholder()} onChange={handleChangeValue} disabled={selectDisabled}
      //         displayRender={page ? (label, selectedOptions) => {
      //           console.log(label, selectedOptions)
      //           if (selectedOptions.length == 4) return label.join('/')
      //           else if (selectedOptions.length >= 1 && selectedOptions.length <= 3) return '请选择正确的考场'
      //           else return
      //         } : (label) => { return label.join('/') }}
      //         getPopupContainer={triggerNode => triggerNode.parentNode} />
      //       : (null)
      //     }
      //   </>)
     
      case 'selectTree':
        const config = {}
        if (options.split('_')[1] === 'more') {
          // config.showCheckedStrategy = SHOW_ALL
          config.treeCheckable = true
        }
        return (<>
          {isEdit
            ? <TreeSelect value={itemValue || []} style={{ width: '100%' }} disabled={selectDisabled} allowClear
              placeholder={_placeholder()} dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              onChange={handleChangeValue} treeData={optionsArr} {...config}
              getPopupContainer={triggerNode => triggerNode.parentNode}>
            </TreeSelect>
            : showDefaultEchoText()}
        </>)
      case 'occupy':
        return (<></>)
      default:
        break
    }
  }
  const dropdownCascaderLazy = (menus) => {
    return (
      <Spin spinning={dropdownLoading}>
        <div>
          {menus}
          <Divider style={{ margin: 0 }} />
          <div style={{ padding: 8 }}>加载更多</div>
        </div>

      </Spin>

    );
  }
  useEffect(() => {
    if (isArray(options)) resetOptions(options)
  }, [options])

  useEffect(() => {
    if (isArray(value) && type == 'selectTree') setItemValue(value || [])
  }, [value])

  useEffect(() => {
    const { value, resetSearch } = props
    // 绑定默认值
    value && props.setFieldsValue({ [props.variables]: value })
    resetSearch && resetSearch({ [props.variables]: value })
    switchMap()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const _nameObj = variables ? { name: variables } : {}
  return (
    <Form.Item label={label} {..._nameObj} rules={rules} style={styleObj()}
      className='searchFormItem'>
      {rederNodeExample(type)}
    </Form.Item>
  )
}

export default SearchItem