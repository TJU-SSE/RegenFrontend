import CryptoJS from 'crypto-js'

/* 提交地址
 * 华东空间使用 upload.qiniup.com
 * 华北空间使用 upload-z1.qiniu.com
 * 华南空间使用 upload-z2.qiniu.com
 * 北美空间使用 upload-na0.qiniu.com
 */

let action = 'https://upload.qiniup.com'

// 空间名

let bucketName = 'infotest'

// AccessKey

let AK = 'opKzqbb_E-y_yKjCufAu8KOiBzlhMXH2G-EXuKVj'

//  SecretKey

let SK = 'b6pyxBh1o8PCNALdlihIZv54wOxqrbxVohrRLQPH'

// 空间绑定域名

let domain = 'http://pc0bksa0g.bkt.clouddn.com/'

/* utf.js - UTF-8 <=> UTF-16 convertion
 *
 * Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
 * Version: 1.0
 * LastModified: Dec 25 1999
 * This library is free. You can redistribute it and/or modify it.
 */
/*
 * Interfaces:
 * utf8 = utf16to8(utf16);
 * utf16 = utf8to16(utf8);
 */

function utf16to8 (str) {
  let out, i, len, c
  out = ''
  len = str.length
  for (i = 0; i < len; i++) {
    c = str.charCodeAt(i)
    if ((c >= 0x0001) && (c <= 0x007F)) {
      out += str.charAt(i)
    } else if (c > 0x07FF) {
      out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F))
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F))
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
    } else {
      out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F))
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
    }
  }
  return out
}

/*
 * Interfaces:
 * b64 = base64encode(data);
 * data = base64decode(b64);
 */
let base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'

function base64encode (str) {
  let out, i, len
  let c1, c2, c3
  len = str.length
  i = 0
  out = ''
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff
    if (i === len) {
      out += base64EncodeChars.charAt(c1 >> 2)
      out += base64EncodeChars.charAt((c1 & 0x3) << 4)
      out += '=='
      break
    }
    c2 = str.charCodeAt(i++)
    if (i === len) {
      out += base64EncodeChars.charAt(c1 >> 2)
      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4))
      out += base64EncodeChars.charAt((c2 & 0xF) << 2)
      out += '='
      break
    }
    c3 = str.charCodeAt(i++)
    out += base64EncodeChars.charAt(c1 >> 2)
    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4))
    out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6))
    out += base64EncodeChars.charAt(c3 & 0x3F)
  }
  return out
}

let safe64 = function (base64) {
  base64 = base64.replace(/\+/g, '-')
  base64 = base64.replace(/\//g, '_')
  return base64
}

let genUpToken = function (accessKey, secretKey, putPolicy) {
  // SETP 2
  let putPolicy1 = JSON.stringify(putPolicy)
  // SETP 3
  let encoded = base64encode(utf16to8(putPolicy1))
  // SETP 4
  let hash = CryptoJS.HmacSHA1(encoded, secretKey)
  let encodedSigned = hash.toString(CryptoJS.enc.Base64)
  // SETP 5
  let uploadToken = accessKey + ':' + safe64(encodedSigned) + ':' + encoded
  return uploadToken
}

let token = () => {
  let policy = {}
  let deadline = Math.round(new Date().getTime() / 1000) + 3600
  policy.scope = bucketName
  policy.deadline = deadline
  return genUpToken(AK, SK, policy)
}

export {
  token, action, domain
}
