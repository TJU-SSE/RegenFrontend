import httpRequest from './httpRequest'
import backendUrl from '../config/backendUrl'
import env from '../config/env'

export default {
  async getAll (context) {
    try {
      let response = await httpRequest(context, backendUrl.INDEX_GET_ALL, 'get')
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
      let response = await httpRequest(context, backendUrl.INDEX_CREATE, 'post', postData)
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
      let response = await httpRequest(context, backendUrl.INDEX_DELETE, 'post', postData)
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
      let response = await httpRequest(context, backendUrl.INDEX_UPDATE, 'post', postData, env.REQUIRE_HEAD_TYPE.JSON)
      return response.body
    } catch (exception) {
      return {
        code: env.RESP_CODE.FAIL,
        err: exception
      }
    }
  }
}
