import httpRequest from './httpRequest'
import backendUrl from '../config/backendUrl'
import env from '../config/env'
import CommonUtils from '../config/CommonUtils'

export default {
  async create (context, postData) {
    try {
      let response = await httpRequest(context, backendUrl.NEWS_CREATE, 'post', postData, env.REQUIRE_HEAD_TYPE.FORM_DATA)
      return response.body
    } catch (exception) {
      return {
        code: env.RESP_CODE.FAIL,
        err: exception
      }
    }
  },
  async getAll (context, pageOffset, itemSize = env.PAGE_ITEM_SIZE) {
    try {
      let response = await httpRequest(context,
        `${backendUrl.NEWS_GET_ALL}?pageOffset=${pageOffset - 1}&itemSize=${itemSize}`, 'get')
      if (response.body.code === env.RESP_CODE.SUCCESS) {
        response.body.msg.newses = response.body.msg.newses.map((news) => {
          return {
            imgUrl: news.cover_img,
            title: news.title,
            author: news.writer,
            tag: news.tag,
            date: CommonUtils.getDateStrFromTimestamp(news.time),
            newsId: news.newsId
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
  async getDetail (context, newsId) {
    try {
      let response = await httpRequest(context, backendUrl.NEWS_GET_DETAIL + newsId, 'get')
      if (response.body.code === env.RESP_CODE.SUCCESS) {
        let msg = response.body.msg
        response.body.msg = {
          id: msg.id,
          author: msg.writer,
          title: msg.title,
          content: msg.content,
          date: CommonUtils.getDateStrFromTimestamp(msg.time),
          tag: msg.tag,
          imgUrl: msg.img_url
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
      let response = await httpRequest(context, backendUrl.NEWS_UPDATE, 'post', postData)
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
      let response = await httpRequest(context, backendUrl.NEWS_UPDATE_IMG, 'post', postData, env.REQUIRE_HEAD_TYPE.FORM_DATA)
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
      let response = await httpRequest(context, backendUrl.NEWS_DELETE, 'post', postData)
      return response.body
    } catch (exception) {
      return {
        code: env.RESP_CODE.FAIL,
        err: exception
      }
    }
  },

  async getNewsRecommend (context, newsId) {
    try {
      let response = await httpRequest(context, backendUrl.NEWS_RECOMMAND + newsId, 'get')
      if (response.body.code === env.RESP_CODE.SUCCESS) {
        response.body.msg.newses = response.body.msg.newses.map((news) => {
          return {
            imgUrl: news.cover_img,
            title: news.title,
            author: news.writer,
            tag: news.tag,
            date: CommonUtils.getDateStrFromTimestamp(news.time),
            newsId: news.newsId
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
  }
}
