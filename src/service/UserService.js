import httpRequest from './httpRequest'
import backendUrl from '../config/backendUrl'
import env from '../config/env'

export default {
  async login (context, postData) {
    try {
      let response = await httpRequest(context, backendUrl.LOGIN, 'post', postData)
      return response.body.code === env.RESP_CODE.SUCCESS
    } catch (exception) {
      return false
    }
  }
}
