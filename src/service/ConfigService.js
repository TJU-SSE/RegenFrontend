import httpRequest from './httpRequest'
import backendUrl from '../config/backendUrl'
import env from '../config/env'
// import CommonUtils from '../config/CommonUtils'

export default {
  async get (context) {
    try {
      let response = await httpRequest(context, backendUrl.CONFIG_FOOTER_LINK, 'get')
      return response.body
    } catch (exception) {
      return {
        code: env.RESP_CODE.FAIL,
        err: exception
      }
    }
  },

  async update (context, content) {
    try {
      let response = await httpRequest(context, backendUrl.CONFIG_FOOTER_LINK, 'post', {content})
      return response.body
    } catch (exception) {
      return {
        code: env.RESP_CODE.FAIL,
        err: exception
      }
    }
  }
}
