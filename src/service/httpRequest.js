import env from '../config/env'
import toastr from 'toastr'

async function request (context, url = '', method = 'get', data = {}, headType = env.REQUIRE_HEAD_TYPE.OTHER) {
  method = method.toUpperCase()
  url = env.BASE_URL + url
  let header = {}
  console.log('[REQUEST]', method, url, data)

  switch (method) {
    case 'GET':
      header = { emulateJSON: true }
      return context.$http.get(url, header)
    case 'POST':
      switch (headType) {
        case env.REQUIRE_HEAD_TYPE.FORM_DATA:
          header = {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            credentials: true
          }
          break
        case env.REQUIRE_HEAD_TYPE.JSON:
          header = {
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: true
          }
          break
        default:
          header = { emulateJSON: true, credentials: true }
      }
      let resp = await context.$http.post(url, data, header)
      console.log('[REQUEST Back]', method, url, data, resp)
      if (resp.body.code === env.RESP_CODE.NO_LOGIN) {
        console.log('not login')
        context.$router.push({
          name: 'login'
        })
        toastr.error('登录失效，请重新登录')
        return null
      }
      return resp
  }
}

export default request
