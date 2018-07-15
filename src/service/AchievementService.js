import httpRequest from './httpRequest'
import backendUrl from '../config/backendUrl'
import env from '../config/env'
import CommonUtils from '../config/CommonUtils'

export default {
  async getAll (context, artistId, pageOffset, itemSize = env.PAGE_ITEM_SIZES.PRODUCT_ARTIST) {
    try {
      let response = await httpRequest(context,
        `${backendUrl.ARTIST_PRODUCT_GET_ALL}/${artistId}?pageOffset=${pageOffset - 1}&itemSize=${itemSize}`, 'get')
      console.log(response)
      if (response.body.code === env.RESP_CODE.SUCCESS) {
        response.body.msg.artistProducts = response.body.msg.artistProducts.map((artistProduct, index) => {
          return {
            id: artistProduct.productId,
            time: CommonUtils.formatDate(new Date(artistProduct.releaseTime), 'yyyy-MM-dd'),
            desc: artistProduct.session,
            title: artistProduct.title,
            imgUrl: artistProduct.img_url,
            tag: '',
            showId: index,
            rank: artistProduct.rank
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

  async create (context, postData) {
    try {
      let response = await httpRequest(context, backendUrl.ARTIST_PRODUCT_CREATE, 'post', postData)
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
      let response = await httpRequest(context, backendUrl.ARTIST_PRODUCT_DELETE, 'post', postData)
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
      let response = await httpRequest(context, backendUrl.ARTIST_PRODUCT_UPDATE, 'post',
        postData, env.REQUIRE_HEAD_TYPE.JSON)
      return response.body
    } catch (exception) {
      return {
        code: env.RESP_CODE.FAIL,
        err: exception
      }
    }
  }
}
