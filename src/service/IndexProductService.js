import httpRequest from './httpRequest'
import backendUrl from '../config/backendUrl'
import env from '../config/env'

export default {
  async getAll (context, pageOffset, itemSize) {
    try {
      let response = await httpRequest(
        context,
        `${backendUrl.INDEX_PRODUCT_ALL}?itemSize=${itemSize}&pageOffset=${pageOffset - 1}`,
        'get'
      )
      return response.body
    } catch (exception) {
      return {
        code: env.RESP_CODE.FAIL,
        err: exception
      }
    }
  },

  async getAllWithTags (context, pageOffset, itemSize, tags) {
    try {
      let tagsQuery = ''
      tags.forEach((tag) => {
        tagsQuery += `&tag=${tag}`
      })
      let response = await httpRequest(
        context,
        `${backendUrl.INDEX_PRODUCT_ALL_WITH_TAGS}?itemSize=${itemSize}&pageOffset=${pageOffset - 1}${tagsQuery}`,
        'get'
      )
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
      let response = await httpRequest(context, backendUrl.INDEX_PRODUCT_CREATE, 'post', postData)
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
      let response = await httpRequest(context, backendUrl.INDEX_PRODUCT_DELETE, 'post', postData)
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
      let response = await httpRequest(context, backendUrl.INDEX_PRODUCT_UPDATE, 'post', postData, env.REQUIRE_HEAD_TYPE.JSON)
      return response.body
    } catch (exception) {
      return {
        code: env.RESP_CODE.FAIL,
        err: exception
      }
    }
  }
}
