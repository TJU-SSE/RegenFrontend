import httpRequest from './httpRequest'
import backendUrl from '../config/backendUrl'
import env from '../config/env'
import CommonUtils from '../config/CommonUtils'

export default {
  async getUpdateAll (context, artistId, pageOffset, itemSize = env.PAGE_ITEM_SIZES.PRODUCT_ARTIST) {
    try {
      let response = await httpRequest(context,
        `${backendUrl.ARTIST_PRODUCT_GET_ALL}/${artistId}?pageOffset=${pageOffset - 1}&itemSize=${itemSize}`, 'get')
      if (response.body.code === env.RESP_CODE.SUCCESS) {
        response.body.msg.artistProducts = response.body.msg.artistProducts.map((artistProduct, index) => {
          return {
            id: artistProduct.productId,
            time: CommonUtils.getDateStrFromOBj(CommonUtils.getObjFromTimestamp(artistProduct.releaseTime)),
            desc: artistProduct.session,
            title: artistProduct.title,
            imgUrl: artistProduct.img_url,
            tag: '',
            showId: index,
            rank: artistProduct.rank,
            introduction: JSON.parse(artistProduct.introduction)
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

  async getAchievementAll (context, artistId, pageOffset, itemSize = env.PAGE_ITEM_SIZES.PRODUCT_ARTIST) {
    try {
      let response = await httpRequest(context,
        `${backendUrl.ACHIEVEMENT_GET_ALL}/${artistId}?pageOffset=${pageOffset - 1}&itemSize=${itemSize}`, 'get')
      console.log('getAchievementAll', response)
      if (response.body.code === env.RESP_CODE.SUCCESS) {
        response.body.msg.achievements = response.body.msg.achievements.map((artistProduct, index) => {
          return {
            id: artistProduct.productId,
            time: CommonUtils.getDateStrFromOBj(CommonUtils.getObjFromTimestamp(artistProduct.releaseTime)),
            desc: artistProduct.session,
            title: artistProduct.title,
            imgUrl: artistProduct.img_url,
            tag: '',
            showId: index,
            rank: artistProduct.rank,
            introduction: JSON.parse(artistProduct.introduction)
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

  async getAll (context, artistId, pageOffset, type = env.ARTIST_PRODUCT_TYPES.UPDATES,
                itemSize = env.PAGE_ITEM_SIZES.PRODUCT_ARTIST) {
    if (type === env.ARTIST_PRODUCT_TYPES.UPDATES) {
      return await this.getUpdateAll(context, artistId, pageOffset, itemSize)
    } else if (type === env.ARTIST_PRODUCT_TYPES.ACHIEVEMENT) {
      return await this.getAchievementAll(context, artistId, pageOffset, itemSize)
    }
  },

  async create (context, postData, type = env.ARTIST_PRODUCT_TYPES.UPDATES) {
    try {
      let url = null
      if (type === env.ARTIST_PRODUCT_TYPES.UPDATES) {
        url = backendUrl.ARTIST_PRODUCT_CREATE
      } else {
        url = backendUrl.ACHIEVEMENT_CREATE
      }
      let response = await httpRequest(context, url, 'post', postData)
      return response.body
    } catch (exception) {
      return {
        code: env.RESP_CODE.FAIL,
        err: exception
      }
    }
  },

  async delete (context, postData, type = env.ARTIST_PRODUCT_TYPES.UPDATES) {
    try {
      let url = null
      if (type === env.ARTIST_PRODUCT_TYPES.UPDATES) {
        url = backendUrl.ARTIST_PRODUCT_DELETE
      } else {
        url = backendUrl.ACHIEVEMENT_DELETE
      }
      let response = await httpRequest(context, url, 'post', postData)
      return response.body
    } catch (exception) {
      return {
        code: env.RESP_CODE.FAIL,
        err: exception
      }
    }
  },

  async update (context, postData, type = env.ARTIST_PRODUCT_TYPES.UPDATES) {
    try {
      let url = null
      if (type === env.ARTIST_PRODUCT_TYPES.UPDATES) {
        url = backendUrl.ARTIST_PRODUCT_UPDATE
      } else {
        url = backendUrl.ACHIEVEMENT_UPDATE
      }
      let response = await httpRequest(context, url, 'post', postData, env.REQUIRE_HEAD_TYPE.JSON)
      return response.body
    } catch (exception) {
      return {
        code: env.RESP_CODE.FAIL,
        err: exception
      }
    }
  }
}
