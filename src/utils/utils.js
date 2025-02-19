 
  import React from 'react'
  import { Modal, message } from 'antd'
  import api from '@/actions'
  import { ExclamationCircleOutlined } from '@ant-design/icons'

  const AES = require('crypto-js');
  const key = AES.enc.Utf8.parse('0123456789ASDFGH'); //十六位十六进制数作为密钥
  const iv = AES.enc.Utf8.parse('ASDFGH0123456789'); //十六位十六进制数作为密钥偏移量

  const { confirm } = Modal

 export const author = localStorage.getItem("Author") //获取当前用户权限
 
 /**
    * @description: 获取权限路由
    * @param {*} arr 路由表
    * @return {*} 对应权限的路由
    */  
 export const getRolesRoute=(routes)=>{
    let _rou = []
    const addRouter = (arr) => {
      let _arr = []
      arr.map(_r => {
        let _obj = {}
        _obj = _r
        // _obj.label= _r.label
        // _obj.key= _r.key
        // _obj.component= _r.component
        if(_r.roles){
            if(_r.roles.includes(author)){
                _arr.push(_obj)
            } 
        }else{
            _arr.push(_obj)
        }
        if (_r.children && _r.children.length > 0) {
            _obj.children = addRouter(_r.children)
        }
      })
      return _arr
    }
    _rou = addRouter(routes)
    if(_rou.length>0) {
        _rou.forEach((v,i)=>{
            if(v.children&&v.children.length===0) delete v.children
        })
    }
    return _rou
}
 /**
    * @description: 整理路由
    * @param {*} arr 路由表
    * @return {*} 新的路由
    */ 

export const _splitArr = (route) => {
    const _arr = []
    const addRouter = (arr) => {
      arr.map(_r => {
        if (_r.children && _r.children.length > 0) {
          addRouter(_r.children)
        }
        _arr.push(_r)
      })
    }
    addRouter(route)
    return _arr
  }

  /**
   * @description: 生成文件
   * @param {*} action 请求api
   * type==image时，为图片oss地址,当type==zip时，为接口api
   * @param {*} params 请求参数
   * @param {*} type 下载类型 [image/zip]
   * @param {*} fileName  生成文件名
   * @return {*}
   */
  export const ExportFiles = async (action, params, type='image', fileName="image") => {
    message.loading({content:'正在下载',key:1,duration:0})
    const download = (url) => {
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      const evt = document.createEvent('MouseEvents')
      evt.initEvent('click', true, true)
      link.dispatchEvent(evt)
      link.remove()
    }
    if(type=='zip') {
      const result = await api[action](params)
      if(result) message.success({content:'下载成功',key:1,duration:1.5})
      else message.error({content:'下载失败',key:1,duration:1.5})
      const blob = new Blob([result],{type: 'application/zip'})
      download(window.URL.createObjectURL(blob))
    } else if(type == 'image') {
      const image = new Image()
      image.setAttribute("crossOrigin", "anonymous")
      image.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = image.width
        canvas.height = image.height
        const context = canvas.getContext("2d")
        context.drawImage(image, 0, 0, image.width, image.height)
        download(canvas.toDataURL("image/png"))
      }
      image.src = action
      message.success({content:'下载成功',key:1,duration:1.5})
    }else  message.loading({content:'正在下载',key:1,duration:1})
  }
  /**
   * @description: 同步操作，请求数据
   * @param {*} callback 回调函数
   * @return {*} Promise结果
   */
  export const validatePromise = (callback) => {
    return new Promise(async resolve => {
      const result = await callback()
      resolve(result)
    })
  }
  /**
   * @description: 是否为对象
   * @param {*} value
   * @return {*}
   */
  export const isObject = (value) => {
    return Object.prototype.toString.call(value)==="[object Object]"
  }
  /**
   * @description: 判断是否为空
   * @param {*} value
   * @return {*}
   */
  export const isNull = (value) => {
    return [undefined, null, ''].includes(value)
  }
  /**
   * @description: 是否为数组
   * @param {*} value
   * @return {*}
   */
  export const isArray = (value) => {
    return Object.prototype.toString.call(value)==="[object Array]"
  }
  /**
   * @description: 拼接参数为URL地址格式
   * @param {*} params 携参值 【Object：键值对】
   * @return {*}
   */
  export const setParamsUrl = (params = null) => {
    let paramsPath = ''
    params && Object.keys(params).map(key => paramsPath += `&${key}=${params?.[key]??''}` )
    paramsPath = paramsPath?'?'+paramsPath.substring(1):''
    return paramsPath
  }
  /**
   * @description: 跳转新页面显示详情
   * @param {*} params  跳转携参值 【Object：键值对】
   * @param {*} path  跳转路径
   * @return {*}
   */
  export const skipDetail = ({params = null, path}) => {
    let paramsPath = setParamsUrl(params)
    window.open(path+paramsPath, '_blank')
  }

  /**
   * @description: 确认框提醒
   * @param {*} title 确认框标题
   * @param {*} content 确认框内容
   * @param {*} onOk 确认框确认方法
   * @param {*} onCancel 确认框取消方法
   * @param {*} icon 确认框icon
   * @return {*}
   */
  export const confirmModal = ({title, content, onOk, onCancel, okText= "确定",
    cancelText= "取消", icon=<ExclamationCircleOutlined />}) => {
    confirm({
      title, icon, content, okText, cancelText,
      onOk, onCancel
    })
  }
  /**
   * @description: 提交成功信息
   * @param {*} msg 操作状态
   * @return {*}
   */
  export const successMessage = (msg) => {
    message.success(msg)
  }
  /**
   * @description: 比较对象中属性是否有变动
   * @param {*} node_a 对象A
   * @param {*} node_b 对象B
   * @return {Boolean} 是否有变动
   */
  export const isObjectValueEqual = (node_a, node_b) => {
    const aProps = Object.getOwnPropertyNames(node_a)
    const bProps = Object.getOwnPropertyNames(node_b)
    if (aProps.length !== bProps.length) {
      return false
    }
    for (let i = 0; i < aProps.length; i++) {
      const propName = aProps[i]
      if (node_a[propName] !== node_b[propName]) {
        return false
      }
    }
    return true
  }
  /**
   * 返回图表的 dataURL 用于生成图片。
   * @param {*} chart 需要获取 DataURL 的 chart 实例
   * @returns {String} 返回图表的 dataURL
   */
   export const chartToDataURL = (chart) => {
    const canvas = chart.getCanvas()
    const renderer = chart.renderer
    const canvasDom = canvas.get('el')
    let dataURL = ''
    if (renderer === 'svg') {
      const clone = canvasDom.cloneNode(true)
      const svgDocType = document.implementation.createDocumentType(
        'svg',
        '-//W3C//DTD SVG 1.1//EN',
        'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'
      )
      const svgDoc = document.implementation.createDocument('http://www.w3.org/2000/svg', 'svg', svgDocType)
      svgDoc.replaceChild(clone, svgDoc.documentElement)
      const svgData = new XMLSerializer().serializeToString(svgDoc)
      dataURL = 'data:image/svg+xml;charset=utf8,' + encodeURIComponent(svgData)
    } else if (renderer === 'canvas') {
      dataURL = canvasDom.toDataURL('image/png')
    }
    return dataURL
  }
  /**
   * @description: 判断是否为闰年的函数
   * @param {*} year
   * @return {*}
   */
  export const isRunyear = (year) => {          
    let flag = false
    if((year%4==0 && year%100!=0) || year%400==0) flag = true
    return flag
  }
  /**
   * @description: 判断是否为闰年的函数
   * @param {*} auditObj 差异数据 { *: { old: *, new: * }} }
   * @return {*}
   */
   export const auditData = (objParam, moudles) => {          
    let oldData = {}, _audit = objParam?.auditEdit?JSON.parse(objParam.auditEdit)[moudles]:{}
    Object.keys(_audit).map(key => {
      if(_audit[key]?.new) oldData[key] = _audit[key]?.old??_audit[`${key}Name`]?.old??' '
      return true
    })
    return { old: oldData, now: objParam }
  }
  /**
   * @description: 递归遍历重新排列值
   * @param {*} arr 遍历数组
   * @param {*} variables 得到的字段集合
   * @return {_value} 数据集合
   */
  export const recursionArray_Tree = (arrOrigin) => {
    let _valueArray = []
    const recursion = (_arrO) => {
      let _arr = []
      _arrO.map(item => {
        let _obj = {}
        _obj.value = item.sysResource.id
        _obj.key = item.sysResource.id
        _obj.title = item.sysResource.name
        if(item?.child && item?.child.length>0) 
          _obj.children = recursion(item.child)
          else delete item.child
        _arr.push(_obj)
      })
      return _arr
    }
    _valueArray = recursion(arrOrigin)
    return _valueArray
  }
  /**
   * @description: 递归遍历对比求值
   * @param {*} arrOrigin 遍历数组
   * @param {*} arrDiffValue 遍历源数组
   * @param {*} variables 对比字段
   * @param {*} reValue 得到的字段集合
   * @return {_value} 数据集合
   */
  export const recursionArrayDiff = (arrOrigin, arrDiffValue, variables, reValue) => {
    let _valueArray = [], diffI = 0
    const recursion = (_arrO, _arrD) => {
      _arrO.map(parents => {
        if(parents[variables] == _arrD) {
          _valueArray.push(parents[reValue])
          if(parents.children && parents.children.length>0) {
            diffI+=1
            recursion(parents.children, arrDiffValue[diffI])
          }
        }
        return true
      })
    }
    recursion(arrOrigin, arrDiffValue[diffI])
    return _valueArray
  }
  /**
   * @description: 查询条件-地域&行业
   * @param {*} obj 【Object】查询条件源数据
   * @param {*} variables 【String】对比字段
   * @param {*} reValue 【Array】查询条件返回条件集合
   * @return {obj} 更改后的对象
   */
  export const resetSearch_industryArea = (obj, variables, reValue) => {
    if(obj?.[variables]?.length>0){
      let reKeyList = {}
      reValue.map(reKey => reKeyList[reKey] = [] )
      obj[variables].map(item => {
        item.level=='1' && reKeyList[reValue[0]].push(Number(item.id))
        item.level=='2' && reKeyList[reValue[1]].push(Number(item.id))
        item.level=='3' && reKeyList[reValue[2]].push(Number(item.id))
      })
      obj[reValue[0]] = reKeyList[reValue[0]]
      obj[reValue[1]] = reKeyList[reValue[1]]
      obj[reValue[2]] = reKeyList[reValue[2]]
      obj[variables] = undefined
    } else obj[variables] = obj[reValue[0]] = obj[reValue[1]] = obj[reValue[2]] = undefined
  }
  /**
   * @description: 查询条件-时间区间
   * @param {*} obj 【Object】查询条件源数据
   * @param {*} variables 【String】对比字段
   * @param {*} reValue 【Array】查询条件返回条件集合
   * @return {*}
   */
  export const resetSearch_time = (obj, variables, reValue) => {
    if(obj?.[variables]?.length>0) {
      obj[reValue[0]] = obj?.[variables][0]
      obj[reValue[1]] = obj?.[variables][1]
      obj[variables] = undefined
    } else obj[variables] = obj[reValue[0]] = obj[reValue[1]] = undefined
  }
  /**
   * @description: 指定截取小数点位数
   * @param {*} value 需要截取的数值
   * @param {*} decimal 需要截取的小数位数
   * @return {*}
   */
  export const toFixedUnit = (value, decimal) => {
    if(!value) return 0
    value = value.toString()
    let index = value.indexOf('.')
    if (index !== -1) value = value.substring(0, decimal + index + 1)
      else value = value.substring(0)
    return Number(parseFloat(value).toFixed(decimal))
  }
  
  /**
   * @description: 获取接口数据
   * @param {*} value 需要截取的数值
   * @return {*}
   */
  
   export const getInterfaceData = (_api, _option) => {
    return new Promise(async (resolve,reject) => {
        if (_api) {
            let result = {};
            await api[_api](_option).then(res=>{
              result = res;
            }).catch(error=>{
              console.log("接口error");
              console.log(error);
              result = error
            });
            // console.log(result);
            if(result){
              resolve(result)
            }else{
              resolve({})
            }
        }
    })
  
  }
  
  /**
   * @description: 描述：求两个字符串的最长公共子串;算法：动态规划算法
   * @param {type} 
   * @return: 返回最长公共子串的长度
   */
  function find(str1 = "", str2 = "") {
    //创建一个二维数组
    let temp = new Array()
    let max = 0
    let index = null
    for (let i = 0; i < str1.length; i++) {
        //初始化为二维数组
        temp[i] = new Array()
        for (let j = 0; j < str2.length; j++) {
            //比较两个位置是否相等，相等就将让temp[i][j]相对于temp[i-1][j-1]加一（前提是temp[i-1][j-1]存在）
            if (str1.charAt(i) === str2.charAt(j)) {
                if (i > 0 && j > 0 && temp[i - 1][j - 1] > 0) {
                    temp[i][j] = 1 + temp[i - 1][j - 1]
                } else {
                    temp[i][j] = 1
                }
                //保存当前temp中最大的数字，并
                if (max < temp[i][j]) {
                    max = temp[i][j]
                    index = i
                }
            } else {
                temp[i][j] = 0
            }
        }
    }
    return str1.substr(index - max + 1, max).length
  }
  /**
   * @description: 描述：密码不允许键盘排序密码
   * @param :{password:密码} 
   * @return: Boolean 校验是否通过，true：通过；false：不通过
   */
  const passwordCanotKeyboard = (password) =>{
    let checkData = [
        [
            `~!@#$%^&*()_+`,
            `QWERTYUIOP{}`,
            `ASDFGHJKL;""`,
            `ZXCVBNM<>?`
        ],
        [
            "`1234567890-=",
            `qwertyuiop[]`,
            `asdfghjkl;'`,
            `zxcvbnm,./`
        ]
    ];
    for(let item of checkData){
        for(let subItem of item){
            if(find(password,subItem)>2){
                return false
            }
        }
    }
    return true;
  }
  /**
   * @description: 描述：密码校验规则 (1、密码长度8位 2、纯数字或者字母加数字 规则废弃) 8到16位数字与字母组合密码
   * @param:{username:账户,password：'密码'}
   * @return: Boolean 校验是否通过，true：通过；false：不通过
   */
  export const checkPassword = (username,password) => {
    let returnFlag = false;
    let msg = '';
    let rule = /^(?![a-zA-Z]+$)[0-9A-Za-z]{8}$/;//纯数字或者字母加数字的8位
    // let rule = /(?!.*\s)(?!^[\u4e00-\u9fa5]+$)(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{8,16}$/;//8到16位的数字、字母或字符至少两种组合
    let empty = /^[^\s]*$/
    if(!password){
      returnFlag = false;
      msg ='请输入密码'
    }
    else if(!empty.test(password)){
      returnFlag = false;
      msg ='不可输入空格'
    }
    // else if (!rule.test(password)) {
    //   returnFlag = false;
    //   msg ='密码不符合规则，需是纯数字或者字母加数字的8位'
    // } 
    // else if (fArr.length>0 ) {
    //   //非特殊字符
    //   returnFlag = false;
    //   msg = '密码强度较弱'
    // } 
    // else if ( username&& password.toLowerCase()== username.toLowerCase()) {
    //   //用户名和密码无相关性
    //   returnFlag = false;
    //   msg = '密码不可和用户名相同'
    // } 
    // else if (!passwordCanotKeyboard(password)) {
    //   // 密码按照键盘排列
    //   returnFlag = false;
    //   msg = '密码不可按照键盘排列'
    // }
     else {
      returnFlag = true;
    }
    let obj = {returnFlag,msg}
    return obj
  };
  /**
   * @description: 描述：账号校验规则 纯数字或字母加数字
   * @return: Boolean 校验是否通过，true：通过；false：不通过
   */
  export const checkAccount = (account) => {
    let returnFlag = false;
    let msg = '';
    // let rule = /^1[34578]\d{9}$/ //手机号校验规则
    let rule = /^(?![a-zA-Z]+$)[0-9A-Za-z]{11,20}$/
    let empty = /^[^\s]*$/
    if(!account){
      returnFlag = false;
      msg ='请输入账号'
    }
    else if(!empty.test(account)){
      returnFlag = false;
      msg ='不可输入空格'
    }
    // else if (!rule.test(account)) {
    //   returnFlag = false;
    //   msg ='格式错误,请输入11位到20位的纯数字或字母加数字'
    // }
     else {
      returnFlag = true;
    }
    let obj = {returnFlag,msg}
    return obj
  };
  
  // string转base64
  export const stringToBase64 = (str) => {
    let encode = encodeURI(str);
    // 对编码的字符串转化base64
    return btoa(encode);
  }


// AES加密
export const  encrypt = (word)=> {
  const src = AES.enc.Utf8.parse(word);
  const encrypted = AES.AES.encrypt(src, key, { iv, mode: AES.mode.CBC, padding: AES.pad.Pkcs7 });
  return encrypted.ciphertext.toString().toUpperCase();
};

// AES解密
export const decrypt =(word)=> {
  const encryptedHexStr = AES.enc.Hex.parse(word);
  const src = AES.enc.Base64.stringify(encryptedHexStr);
  const decrypt = AES.AES.decrypt(src, key, { iv, mode: AES.mode.CBC, padding: AES.pad.Pkcs7 });
  const decryptedStr = decrypt.toString(AES.enc.Utf8);
  return decryptedStr.toString();
}
  


export const modulesConfig={}


/**
 * @description: 获取变量值
 * @param {*} key 存储变量对应的key值
 * @param {*} parames 存储变量对应的value值
 * @return {*}
 */
export const getModulesConfig = (key, parames) => {
  console.log(key, parames)
  modulesConfig[key] = parames
}