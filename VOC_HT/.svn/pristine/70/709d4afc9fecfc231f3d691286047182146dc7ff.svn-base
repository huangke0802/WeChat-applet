const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//获取系统时间
function getFormatDate(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var formatedMonth = month < 10 ? '0' + month : '' + month
  var day = date.getDate()
  var formatedDay = day < 10 ? '0' + day : '' + day
  return year + '-' + formatedMonth + '-' + formatedDay
} 
//结束时间
function getEndTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return year + '-' + month + '-' + day
}  
function formatSelectDate(str, fomit) {
  var arr = str.split(fomit);
  return arr[0] + '-' + arr[1] + '-' + arr[2] ;
}
/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/
function dataFormat(number, format) {
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  var date = new Date(number);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));
  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));
  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}  
/*
 *   功能:实现VBScript的DateAdd功能.
 *   参数:interval,字符串表达式，表示要添加的时间间隔.
 *   参数:number,数值表达式，表示要添加的时间间隔的个数.
 *   参数:date,时间对象.
 *   返回:新的时间对象.
 *   var now = new Date();
 *   var newDate = DateAdd( "d", 5, now);
 *---------------   DateAdd(interval,number,date)   -----------------
 */
function DateAdd(interval, number, date) {
  switch (interval) {
    case "y ": {
      date.setFullYear(date.getFullYear() + number);
      return date;
      break;
    }
    case "q ": {
      date.setMonth(date.getMonth() + number * 3);
      return date;
      break;
    }
    case "m ": {
      date.setMonth(date.getMonth() + number);
      return date;
      break;
    }
    case "w ": {
      date.setDate(date.getDate() + number * 7);
      return date;
      break;
    }
    case "d ": {
      date.setDate(date.getDate() + number);
      return date;
      break;
    }
    case "h ": {
      date.setHours(date.getHours() + number);
      return date;
      break;
    }
    case "m ": {
      date.setMinutes(date.getMinutes() + number);
      return date;
      break;
    }
    case "s ": {
      date.setSeconds(date.getSeconds() + number);
      return date;
      break;
    }
    default: {
      date.setDate(d.getDate() + number);
      return date;
      break;
    }
  }
}
//转码
function utf16toEntities(str) {
  var patt = /[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则  
  str = str.replace(patt, function (char) {
    var H, L, code;
    if (char.length === 2) {
      H = char.charCodeAt(0); // 取出高位  
      L = char.charCodeAt(1); // 取出低位  
      code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法  
      return "&#" + code + ";";
    } else {
      return char;
    }
  });
  return str;
} 

//判断是否存在表情
function isEmojiCharacter(substring) {
  for (var i = 0; i < substring.length; i++) {
    var hs = substring.charCodeAt(i);
    if (0xd800 <= hs && hs <= 0xdbff) {
      if (substring.length > 1) {
        var ls = substring.charCodeAt(i + 1);
        var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
        if (0x1d000 <= uc && uc <= 0x1f77f) {
          return true;
        }
      }
    } else if (substring.length > 1) {
      var ls = substring.charCodeAt(i + 1);
      if (ls == 0x20e3) {
        return true;
      }
    } else {
      if (0x2100 <= hs && hs <= 0x27ff) {
        return true;
      } else if (0x2B05 <= hs && hs <= 0x2b07) {
        return true;
      } else if (0x2934 <= hs && hs <= 0x2935) {
        return true;
      } else if (0x3297 <= hs && hs <= 0x3299) {
        return true;
      } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
        || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
        || hs == 0x2b50) {
        return true;
      }
    }
  }
} 

/**
 * 去掉空格
 */
function trim(str) {
  return str.replace(/(^\s+)|(\s+$)/g, "");
}

module.exports = {
  getFormatDate: getFormatDate,
  getEndTime: getEndTime,
  formatSelectDate: formatSelectDate,
  formatTime: formatTime,
  dataFormat: dataFormat,
  DateAdd: DateAdd,
  utf16toEntities: utf16toEntities,
  isEmojiCharacter:isEmojiCharacter,
  trim:trim
}