import env from './env'

function checkItemInArray (item, array) {
  for (let itemNow of array) {
    if (itemNow === item) {
      return true
    }
  }
  return false
}

function getDateStrFromTimestamp (timestamp) {
  return formatDate(new Date(parseInt(timestamp)), 'yyyy-MM-dd')
}

function formatDate (date, fmt) {
  let o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (let k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  return fmt
}

function getObjFromTimestamp (timestamp) {
  let date = new Date(timestamp)
  let tag = timestamp % 10
  return {
    year: date.getFullYear(),
    month: tag !== env.DATE_TAG.TO_YEAR ? date.getMonth() : 0,
    day: tag === env.DATE_TAG.TO_DAY ? date.getDate() : 0
  }
}

function getTimestampFromObj (year, month, day) {
  let tag = env.DATE_TAG.TO_DAY
  if (month === 0) {
    tag = env.DATE_TAG.TO_YEAR
    day = 1
    month = 1
  } else if (day === 0) {
    tag = env.DATE_TAG.TO_MONTH
    day = 1
  }
  return Date.parse(new Date(year, month - 1, day)) + tag
}

function getDateStrFromOBj (obj) {
  let result = ''
  if (obj.year !== 1900) {
    result += (obj.year + '年')
  }
  if (obj.month !== 0) {
    result += (obj.month + '月')
  }
  if (obj.day !== 0) {
    result += (obj.day + '日')
  }
  return result
}

function emptyArray (array) {
  while ((array.shift()) !== undefined) {}
}

function transformObjToFormData (obj) {
  let dataFrom = new FormData()
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (Array.isArray(obj[key])) {
        obj[key].forEach((value) => {
          dataFrom.append(key, value)
        })
      } else {
        dataFrom.append(key, obj[key])
      }
    }
  }
  return dataFrom
}

function getCurYear () {
  return new Date().getFullYear()
}

function range (start, end) {
  let result = []
  for (; start < end; start++) {
    result.push(start)
  }
  return result
}

function isLeapYear (year) {
  return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)
}

function getDaysWithMonthAndYear (year, month) {
  if (month === 2) {
    if (isLeapYear(year)) {
      return 29
    }
    return 28
  }
  let months = [4, 6, 9, 11]
  if (months.indexOf(month) !== -1) {
    return 30
  }
  return 31
}

function firstLetterUp (str) {
  str = str.toLowerCase()
  let reg = /\b(\w)|\s(\w)/g
  return str.replace(reg, function (m) {
    return m.toUpperCase()
  })
}

function getSplitStr (str) {
  let strs = str.match(/[A-Z]*[a-z]*/g)
  let result = ''
  strs.forEach((curStr, index) => {
    if (curStr !== '') {
      if (index !== 0) {
        result += ' '
      }
      result += firstLetterUp(curStr)
    }
  })
  return result
}

export default {
  checkItemInArray,
  getDateStrFromTimestamp,
  formatDate,
  emptyArray,
  transformObjToFormData,
  range,
  getCurYear,
  isLeapYear,
  getDaysWithMonthAndYear,
  getObjFromTimestamp,
  getTimestampFromObj,
  getDateStrFromOBj,
  getSplitStr
}
