import React, { useEffect, useState, useImperativeHandle } from 'react'
import { Table, Pagination } from 'antd'
import { tableDefaultConfig,isNull } from '@/utils/commonFun'
import style from './index.module.scss'

/**
 * @description: Table表格列表
 * @param {*} tableId 【Number: table表格id[选填], 页面中多个table时必传】
 * @param {*} columns 【Array: 表头】
 * @param {*} dataSource 【Array: 数据源】
 * @param {*} isPagination 【String: 分页类型】custom(自定义分页)/default/close
 * @param {*} paginationConfig 【Object: 分页配置】isPagination==default的时候，需要有onChange回调事件
 * { total: !数据总数, showTotal: 自定义总数文本, size: 每页数据, current: 当前页, simple: 简单分页 }
 * @param {*} isRowSelection 【Boolean: 表格行是否可选择操作】
 * @param {*} rowSelectCallback 【Function: 行选择回调函数】
 * @param {*} recordsId 【String: table行key字段，空为id】
 * @param {*} isBordered 【Boolean: 是否有边框线条】
 * @param {*} tableYOverScroll 【Boolean: 表格y方向是否超出滚动
 * @return {*}
 */
const TableList = (props) => {
  const { tableId=0, columns, dataSource, isPagination='default', paginationConfig={}, 
    isRowSelection, rowSelectCallback, recordsId, isBordered,tableYOverScroll,scroll } = props
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [dataSourceCopy, setDataSourceCopy] = useState(dataSource??[])
  const [scrollH, setScrollH] = useState(0) // 滑动区域高度
  const [isOverflow, setIsOverflow] = useState(false) // 内容是否超出显示区域
  /**
   * @description: 行选择
   */ 
  const selectChange = keys => {
    setSelectedRowKeys(keys)
    rowSelectCallback(keys)
  }
  const rowSelection = isRowSelection?{
    selectedRowKeys: selectedRowKeys, onChange: selectChange
  }:null
  /**
   * @description: 分页器
   */  
  const paginationTypeShow = () => {
    if(dataSourceCopy&&dataSourceCopy.length==0) {
      if(paginationConfig.total==0) paginationConfig.current=0
    }
    if(isPagination=='default') {
      return <div className={style.pagination__wrapper} id={`pagination_${tableId}`}>
        <div>共{paginationConfig.total || 0}条记录</div>
        <Pagination pageSize={paginationConfig.size||tableDefaultConfig.size} 
          {...paginationConfig} current={
            isNull(paginationConfig.current)?tableDefaultConfig.current:paginationConfig.current
          }
          simple={true}/>
      </div>
    } else if (isPagination=='custom') {
      console.log(paginationConfig)
      return <div id={`pagination_${tableId}`}>
        <Pagination pageSize={paginationConfig.size||tableDefaultConfig.size} 
          {...paginationConfig} current={
            isNull(paginationConfig.current)?tableDefaultConfig.current:paginationConfig.current
          }/>
      </div>
    }
  }
  useImperativeHandle(props.cRef, ()=>({
    hotRenewal: (updateFun, newData)=>{
      const updateFuns = {
        copyDataSource, setSelectedRowKeys
      }
      updateFuns[updateFun](newData)
    }
  }))
  /**
   * @description: rowKeyId兼容
   * @param {*} data 【Array: 数据源】
   * @return {*}
   */  
  const copyDataSource = (data=[]) => {
    const newDataSource = data.map((_d,_i) => {
      _d.index = _i
      return _d
    })
    setDataSourceCopy(newDataSource)
  }
  useEffect(()=>{
    if(tableYOverScroll){// 获取table内容高度
      const tableNode = document.getElementById(`tableList_${tableId}`)
      const paginationNode = document.getElementById(`pagination_${tableId}`)
      /** 获取数据内容是否超出table本身最大高度 */
      const _table_header = tableNode.getElementsByClassName('ant-table-thead')[0],
        _table_body = tableNode.getElementsByClassName('ant-table-tbody')[0]
      /** */
      let _distance = 0
      if(tableNode) {
        if(paginationNode) _distance+=paginationNode.offsetHeight
        /** 获取数据内容是否超出table本身最大高度 */
        if(_table_header) _distance+=_table_header.offsetHeight
        const _overflowArea = tableNode.offsetHeight-_distance
        if(_table_body) {
          setIsOverflow(_table_body.offsetHeight>_overflowArea)
        }
        /** */
        setScrollH(_overflowArea)
      }
    }
    copyDataSource(dataSource)
  },[dataSource])
  
  const scrollConfig = isOverflow&&tableYOverScroll ?{
    scroll: { y: scrollH }
  }:{}
  const getRowClassName = (record, index)=>{
    let className = '';
    className = index % 2 === 0 ? style.oddRow : style.evenRow;
    return className
  }
  return <div id={`tableList_${tableId}`} className={style.table_container}>
    <Table columns={columns} dataSource={dataSourceCopy} rowSelection={rowSelection} 
      bordered={isBordered} pagination={false} {...scrollConfig} className={style.table_wrapper}  scroll={scroll}
      rowKey={recordsId?recordsId:(_d)=> _d?.id??_d.index }  rowClassName={(record, index)=>getRowClassName(record, index)}/>
    {/* 分页器 */}
    { paginationTypeShow() }
  </div>
}

export default TableList
