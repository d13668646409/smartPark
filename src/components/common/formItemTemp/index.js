import React from 'react'
import SearchItem from '../searchItem'

/**
 * @description: 表单选项
 * @param {*} 参照SearchItem字段说明
 * @return {*}
 */
const FormItemTemp = (props) => {
  const { item, form, defaultValue } = props
  let defaultConfig = {
    label: item.label,
    variables: item.variables,
    type: item.type,
    rules: item?.rules,
    isEdit: item?.isDisabled?!item?.isDisabled:true,
    colSpan: 10,
    value: defaultValue?.[item.variables]
      ??((item?.type==='select'&&item?.options.includes('_more'))?[]:''),
    placeholder: (item.type==='select'?'请选择':'请输入')+item.label,
    options: item?.options,
    optionsApi: item?.optionsApi,
    callbackType: item?.callbackType,
    reSetDate: props?.reSetDate,
    optionSave: item?.optionSave,
    optionApiParams: item?.optionApiParams
  }
  return (
    <SearchItem {...defaultConfig} {...form} />
  )
}

export default FormItemTemp