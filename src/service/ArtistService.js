import httpRequest from './httpRequest'
import backendUrl from '../config/backendUrl'
import env from '../config/env'
import CommonUtils from '../config/CommonUtils'

export default {
  async getAllByIdentity (context, data, itemSize = env.SECOND_MENU_PAGE_ITEM_SIZE) {
    try {
      let response = await httpRequest(context,
        `${backendUrl.ARTIST_GET_ALL_BY_IDENTITY}/${data.identity}?pageOffset=${data.pageOffset - 1}&itemSize=${itemSize}`, 'get')
      if (response.body.code === env.RESP_CODE.SUCCESS) {
        response.body.msg.artists = response.body.msg.artists.map((artist) => {
          return {
            designerId: artist.id,
            title: artist.name,
            desc: artist.role || artist.identity,
            imgUrl: artist.img_url,
            display: artist.display
          }
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

  async getDetailById (context, id) {
    try {
      let response = await httpRequest(context, backendUrl.ARTIST_GET_DETAIL_BY_NAME + id, 'get')
      if (response.body.code === env.RESP_CODE.SUCCESS) {
        console.log('getDetailById success')
        response.body.msg.social = JSON.parse(response.body.msg.social)
        response.body.msg.address = JSON.parse(response.body.msg.address)
        response.body.msg.extraBiography = JSON.parse(response.body.msg.extraBiography)
        response.body.msg.biography = JSON.parse(response.body.msg.biography)
        if (!response.body.msg.biography.content) {
          response.body.msg.biography.content = []
        }
        if (!response.body.msg.biography.personInfo) {
          response.body.msg.biography.personInfo = []
        }
        if (!response.body.msg.biography.desc) {
          response.body.msg.biography.desc = ''
        }
        if (!response.body.msg.biography.role) {
          response.body.msg.biography.role = ''
        }
      }
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
      postData = {
        id: postData.id,
        name: postData.name,
        identity: postData.identity,
        social: JSON.stringify(postData.social),
        address: JSON.stringify(postData.address),
        extraBiography: JSON.stringify(postData.extraBiography),
        biography: JSON.stringify(postData.biography),
        display: postData.display
      }
      let response = await httpRequest(context, backendUrl.ARTIST_UPDATE_TEXT, 'post', postData)
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
      let response = await httpRequest(context, backendUrl.ARTIST_UPDATE_IMG, 'post',
        CommonUtils.transformObjToFormData(postData), env.REQUIRE_HEAD_TYPE.FORM_DATA)
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
      postData = {
        name: postData.name,
        identity: postData.identity,
        social: JSON.stringify(postData.social),
        address: JSON.stringify(postData.address),
        extraBiography: JSON.stringify(postData.extraBiography),
        biography: JSON.stringify(postData.biography),
        img: postData.img
      }
      let response = await httpRequest(context, backendUrl.ARTIST_CREATE, 'post',
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
      let response = await httpRequest(context, backendUrl.ARTIST_DELETE, 'post', postData)
      return response.body
    } catch (exception) {
      return {
        code: env.RESP_CODE.FAIL,
        err: exception
      }
    }
  }
}
