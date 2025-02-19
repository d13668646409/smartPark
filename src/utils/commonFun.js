 //eslint-disable-line
function accMul(arg1, arg2) {
    let m = 0;
    const s1 = arg1.toString();
    const s2 = arg2.toString();
    m += s1.split(".").length > 1 ? s1.split(".")[1].length : 0;
    m += s2.split(".").length > 1 ? s2.split(".")[1].length : 0;
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / 10 ** m;
  }
  
  export function digitUppercase(n) {
    const fraction = ['角', '分'];
    const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟', '万']];
    let num = Math.abs(n);
    let s = '';
    fraction.forEach((item, index) => {
      s += (digit[Math.floor(accMul(num, 10 * 10 ** index)) % 10] + item).replace(/零./, '');
    });
    s = s || '整';
    num = Math.floor(num);
    for (let i = 0; i < unit[0].length && num > 0; i += 1) {
      let p = '';
      for (let j = 0; j < unit[1].length && num > 0; j += 1) {
        p = digit[num % 10] + unit[1][j] + p;
        num = Math.floor(num / 10);
      }
      s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }
  
    return s
      .replace(/(零.)*零元/, '元')
      .replace(/(零.)+/g, '零')
      .replace(/^整$/, '零元整');
  }
  
  
  /**
   * 生成指定区间的随机整数
   * @param min
   * @param max
   * @returns {number}
   */
  export function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  
  /**
   * 计算提示框的宽度
   * @param str
   * @returns {number}
   */
  export function calculateWidth(arr){
    return 30 + arr[0].length*15
  }
  
  /**
   * 图片预加载
   * @param arr
   * @constructor
   */
  export function preloadingImages(arr) {
    arr.forEach(item=>{
      const img = new Image()
      img.src = item
    })
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
  
  export const validate_password = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{2,5}$/;
  
  /**
   * @description: 列表默认初始数据
   * @param {*}
   * @return {*}
   */
  export const tableDefaultConfig = { current: 1, size: 10 };
  
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
  //获取当前日期并补0
  export const getNowDate=()=>{
    let nowdate = new Date();
    let y = nowdate.getFullYear();
    let m = (nowdate.getMonth()+1).toString().padStart(2,'0');
    let d = nowdate.getDate().toString().padStart(2,'0');
    let currentTime = y+'-'+m+'-'+d;
    return currentTime
  } 
  //优化时间 去除T
  export const getUploadDate=(date)=>{
    if(!date) return
    if(date.indexOf("T")=="-1") return date
    let arr = date.split("T")
    return arr[0]
  }
  
  
  //  秒数转化为时分秒
  export const formatSeconds=(value)=> {
    //  秒
    let second = parseInt(value)
    //  分
    let minute = 0
    //  小时
    let hour = 0
    //  天
    //  let day = 0
    //  如果秒数大于60，将秒数转换成整数
    if (second > 60) {
      //  获取分钟，除以60取整数，得到整数分钟
      minute = parseInt(second / 60)
      //  获取秒数，秒数取佘，得到整数秒数
      second = parseInt(second % 60)
      //  如果分钟大于60，将分钟转换成小时
      if (minute > 60) {
        //  获取小时，获取分钟除以60，得到整数小时
        hour = parseInt(minute / 60)
        //  获取小时后取佘的分，获取分钟除以60取佘的分
        minute = parseInt(minute % 60)
        //  如果小时大于24，将小时转换成天
        //  if (hour > 23) {
        //    //  获取天数，获取小时除以24，得到整天数
        //    day = parseInt(hour / 24)
        //    //  获取天数后取余的小时，获取小时除以24取余的小时
        //    hour = parseInt(hour % 24)
        //  }
      }
    }
  
    let result = '' + parseInt(second) + '秒'
    if (minute > 0) {
      result = '' + parseInt(minute) + '分' + result
    }
    if (hour > 0) {
      result = '' + parseInt(hour) + '小时  ' + result
    }
    //  if (day > 0) {
    //    result = '' + parseInt(day) + '天' + result
    //  }
    // console.log('result：', result)
    return result
  }
  