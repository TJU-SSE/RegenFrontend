import httpRequest from './httpRequest'
import backendUrl from '../config/backendUrl'
import env from '../config/env'
import CommonUtils from '../config/CommonUtils'

export default {
  async getAll (context, pageOffset, itemSize = env.PAGE_ITEM_SIZES.PRODUCT) {
    try {
      let response = await httpRequest(context,
        `${backendUrl.PRODUCT_GET_ALL}?itemSize=${itemSize}&pageOffset=${pageOffset - 1}`, 'get')
      if (response.body.code === env.RESP_CODE.SUCCESS) {
        response.body.msg.products.forEach((product) => {
          product.introduction = JSON.parse(product.introduction)
          // product.releaseTime = CommonUtils.formatDate(new Date(product.releaseTime), 'yyyy-MM-dd')
          product.releaseTime = CommonUtils.getObjFromTimestamp(product.releaseTime)
          product.inputRank = null
        })
      }
      return response.body
    } catch (exception) {
      return {
        code: env.RESP_CODE.FAIL,
        err: exception
      }
    }
  },

  async getAllWithRank (context, artistId, pageOffset,
                        type = env.ARTIST_PRODUCT_TYPES.UPDATES, itemSize = env.PAGE_ITEM_SIZES.PRODUCT) {
    try {
      let url = null
      if (type === env.ARTIST_PRODUCT_TYPES.UPDATES) {
        url = backendUrl.PRODUCT_GET_ALL_WITH_RANK
      } else {
        url = backendUrl.PRODUCT_GET_ALL_WITH_RANK_ACHIEVEMENT
      }
      let response = await httpRequest(context,
        `${url}/${artistId}?itemSize=${itemSize}&pageOffset=${pageOffset - 1}`, 'get')
      if (response.body.code === env.RESP_CODE.SUCCESS) {
        response.body.msg.products.forEach((product) => {
          product.introduction = JSON.parse(product.introduction)
          product.releaseTime = CommonUtils.getObjFromTimestamp(product.releaseTime)
          // product.releaseTime = CommonUtils.formatDate(new Date(product.releaseTime), 'yyyy-MM-dd')
          product.inputRank = null
        })
      }
      return response.body
    } catch (exception) {
      return {
        code: env.RESP_CODE.FAIL,
        err: exception
      }
    }
  },

  async getDetail (context, productId) {
    try {
      let response = await httpRequest(context, backendUrl.PRODUCT_GET_DETAIL + productId, 'get')
      if (response.body.code === env.RESP_CODE.SUCCESS) {
        response.body.msg.product.introduction = JSON.parse(response.body.msg.product.introduction)
        console.log('Time:')
        console.log(response.body.msg.product)
        response.body.msg.product.releaseTime = CommonUtils.getObjFromTimestamp(response.body.msg.product.releaseTime)
          // CommonUtils.formatDate(new Date(response.body.msg.product.releaseTime), 'yyyy-MM-dd')
      }
      return response.body
    } catch (exception) {
      return {
        code: env.RESP_CODE.FAIL,
        err: exception
      }
    }
  },

  async getBrief (context, productId) {
    try {
      let response = await httpRequest(context, backendUrl.PRODUCT_GET_BRIEF + productId, 'get')
      if (response.body.code === env.RESP_CODE.SUCCESS) {
        response.body.msg = response.body.msg.imgs.map(img => img.img_url)
      }
      return response.body
    } catch (exception) {
      return {
        code: env.RESP_CODE.FAIL,
        err: exception
      }
    }
  },

  async create (context, postData) {
    try {
      postData.introduction = JSON.stringify(postData.introduction)
      postData.releaseTime = CommonUtils.getTimestampFromObj(
        postData.releaseTime.year,
        postData.releaseTime.month,
        postData.releaseTime.day
      )
      console.log('postData', postData)
      let response = await httpRequest(context, backendUrl.PRODUCT_CREATE, 'post',
        CommonUtils.transformObjToFormData(postData), env.REQUIRE_HEAD_TYPE.FORM_DATA)
      return response.body
    } catch (exception) {
      return {
        code: env.RESP_CODE.FAIL,
        err: exception
      }
    }
  },

  async update (context, postData) {
    try {
      postData.introduction = JSON.stringify(postData.introduction)
      postData.releaseTime = CommonUtils.getTimestampFromObj(
        postData.releaseTime.year,
        postData.releaseTime.month,
        postData.releaseTime.day
      )
      let response = await httpRequest(context, backendUrl.PRODUCT_UPGRADE, 'post', postData)
      return response.body
    } catch (exception) {
      return {
        code: env.RESP_CODE.FAIL,
        err: exception
      }
    }
  },

  async updateImg (context, postData) {
    try {
      let response = await httpRequest(context, backendUrl.PRODUCT_UPGRADE_IMG, 'post',
        CommonUtils.transformObjToFormData(postData), env.REQUIRE_HEAD_TYPE.FORM_DATA)
      return response.body
    } catch (exception) {
      return {
        code: env.RESP_CODE.FAIL,
        err: exception
      }
    }
  },

  async delete (context, postData) {
    try {
      let response = await httpRequest(context, backendUrl.PRODUCT_DELETE, 'post', postData)
      return response.body
    } catch (exception) {
      return {
        code: env.RESP_CODE.FAIL,
        err: exception
      }
    }
  },

  async addImg (context, postData) {
    try {
      let response = await httpRequest(context, backendUrl.PRODUCT_ADD_IMG,
        'post', CommonUtils.transformObjToFormData(postData), env.REQUIRE_HEAD_TYPE.FORM_DATA)
      return response.body
    } catch (exception) {
      return {
        code: env.RESP_CODE.FAIL,
        err: exception
      }
    }
  },

  async addImgs (context, postData) {
    try {
      let response = await httpRequest(context, backendUrl.PRODUCT_ADD_IMGS,
        'post', CommonUtils.transformObjToFormData(postData), env.REQUIRE_HEAD_TYPE.FORM_DATA)
      return response.body
    } catch (exception) {
      return {
        code: env.RESP_CODE.FAIL,
        err: exception
      }
    }
  },

  async deleteImg (context, postData) {
    try {
      let response = await httpRequest(context, backendUrl.PRODUCT_DELETE_IMG, 'post', postData)
      return response.body
    } catch (exception) {
      return {
        code: env.RESP_CODE.FAIL,
        err: exception
      }
    }
  },

  async search (context, key, pageOffset, itemSize = env.PAGE_ITEM_SIZES.PRODUCT) {
    try {
      let response = await httpRequest(
        context,
        `${backendUrl.PRODUCT_SEARCH}${key}?itemSize=${itemSize}&pageOffset=${pageOffset - 1}`,
        'get'
      )
      if (response.body.code === env.RESP_CODE.SUCCESS) {
        response.body.msg.products.forEach((product) => {
          product.introduction = JSON.parse(product.introduction)
          product.releaseTime = CommonUtils.getObjFromTimestamp(product.releaseTime)
          // product.releaseTime = CommonUtils.formatDate(new Date(product.releaseTime), 'yyyy-MM-dd')
          // product.inputRank = null
        })
      }
      return response.body
    } catch (exception) {
      return {
        code: env.RESP_CODE.FAIL,
        err: exception
      }
    }
  },

  async searchWithRank (context, artistId, type, key, pageOffset, itemSize = env.PAGE_ITEM_SIZES.PRODUCT) {
    try {
      const response = await httpRequest(
        context,
        `${backendUrl.PRODUCT_SEARCH}${artistId}/${type}/${key}?itemSize=${itemSize}&pageOffset=${pageOffset - 1}`,
        'get'
      )
      if (response.body.code === env.RESP_CODE.SUCCESS) {
        response.body.msg.products.forEach((product) => {
          product.introduction = JSON.parse(product.introduction)
          product.releaseTime = CommonUtils.getObjFromTimestamp(product.releaseTime)
          // product.releaseTime = CommonUtils.formatDate(new Date(product.releaseTime), 'yyyy-MM-dd')
          product.inputRank = null
        })
      }
      return response.body
    } catch (exception) {
      return {
        code: env.RESP_CODE.FAIL,
        err: exception
      }
    }
  }
}
