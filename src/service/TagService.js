import httpRequest from './httpRequest'
import backendUrl from '../config/backendUrl'
import env from '../config/env'

export default {
  async getAll (context) {
    try {
      let response = await httpRequest(context, backendUrl.TAG_ALL, 'get')
      if (response.body.code === env.RESP_CODE.SUCCESS) {
        response.body.msg = response.body.msg.map((tag) => {
          return tag.title
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
  async create (context, postData) {
    try {
      let response = await httpRequest(context, backendUrl.TAG_CREATE, 'post', postData)
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
      let response = await httpRequest(context, backendUrl.TAG_DELETE, 'post', postData)
      console.log('use delete')
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
      let response = await httpRequest(context, backendUrl.TAG_UPDATE, 'post', postData)
      console.log('use update')
      return response.body
    } catch (exception) {
      return {
        code: env.RESP_CODE.FAIL,
        err: exception
      }
    }
  },
  async gettags (context) {
    try {
      let response = await httpRequest(context, backendUrl.TAG_ALL, 'get')
      if (response.body.code === env.RESP_CODE.SUCCESS) {
        response.body.msg = response.body.msg.map((tag) => {
          console.log(tag)
          return tag
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
