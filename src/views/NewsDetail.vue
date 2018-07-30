<template>
  <div class="main-container news-detail">
    <div class="edit-btn" @click="editModalInfo.show=true">
      <a href="javascript:"><i class="fa fa-edit fa-lg"></i></a>
    </div>

    <div class="news-wrap">
      <div class="news-margin">
        <div class="news-tag">
          <a href="javascript:" v-for="(tag, index) in news.tag" class="tag-item" :key="index">{{tag}}</a>
        </div>
        <h2 class="news-title">{{news.title}}</h2>
        <div class="social-share" data-initialized="true" id="socialShare">
          <a href="#" class="social-share-icon icon-weibo"></a>
          <a href="#" class="social-share-icon icon-wechat"></a>
          <a href="#" class="social-share-icon icon-twitter"></a>
        </div>
      </div>
      <div>
        <div class="news-float">
          <p class="news-author news-content-row news-detail-p">
            <span class="news-author-by">by</span>
            <span class="news-author-name">{{news.author}}</span>
          </p>
          <p class="news-date news-detail-p">{{news.date}}</p>
        </div>
        <main v-html="htmlContent" class="news-margin news-main">
        </main>
      </div>
      <!--<ul class="icon-group">-->
        <!--<li class="default">-->
          <!--<i class="fa fa-envelope-o fa-lg" aria-hidden="true">-->
          <!--</i>-->
        <!--</li><li class="blue">-->
        <!--<i class="fa fa-twitter fa-lg" aria-hidden="true"></i>-->
      <!--</li><li class="dark-blue">-->
        <!--<i class="fa fa-facebook-f fa-lg" aria-hidden="true"></i>-->
      <!--</li><li class="red">-->
        <!--<i class="fa fa-instagram fa-lg" aria-hidden="true"></i>-->
      <!--</li>-->
      <!--</ul>-->
    </div>
    <footer>
      <h2 class="title">RECOMMENDED</h2>

      <div class="recommended-footer">
        <div
          class="recommended-footer-item"
          v-for="(item, index) in recommended"
          :key="index"
          @click="onRecommendedClick($event,item.newsId)"
        >
          <img :src="item.imgUrl">
          <NewsContent :newsItem="item" :noMargin="true"></NewsContent>
        </div>
      </div>
    </footer>
    <vodal :show="editModalInfo.show"
           :mask="editModalInfo.mask"
           :width="editModalInfo.width"
           :height="editModalInfo.height"
           :measure="editModalInfo.measure"
           animation="rotate"
           @hide="editModalInfo.show = false">
      <div class="edit-container">
        <NewsInput :webTitle="editModalInfo.webTitle"
                   :newsData="news"
                   :isEditing="editModalInfo.isEditing"
                   :isSaving="editModalInfo.isSaving"
                   @onSaveBtnClick="onSaveBtnClick">
        </NewsInput>
      </div>
    </vodal>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import marked from 'marked'
  import Vodal from 'vodal'
  import toastr from '../../node_modules/toastr/build/toastr.min'
  import 'social-share.js/dist/js/social-share.min'
  import 'social-share.js/dist/css/share.min.css'

  import NewsContent from './components/NewsContent'
  import NewsService from '@/service/NewsService'
  import env from '@/config/env'

  import NewsInput from './admin/components/NewsInput'

  export default {
    name: 'newsDetail',
    data () {
      return {
        title: 'news detail',
        newsId: this.$route.params.newsId,
        news: '',
        editModalInfo: {
          show: false,
          mask: true,
          width: 85,
          height: 90,
          measure: '%',
          webTitle: 'Edit News',
          isEditing: true,
          isSaving: false
        },
        recommended: []
      }
    },
    components: {
      NewsContent,
      Vodal,
      NewsInput
    },
    methods: {
      ...mapGetters({
        checkLogin: 'checkLogin'
      }),
      onRecommendedClick (event, newsId) {
        console.log('onRecommendedClick', newsId)
        this.$router.push({
          name: 'newsDetail',
          params: {
            newsId: newsId
          }
        })
      },
      async getNews () {
        let respBody = await NewsService.getDetail(this, this.newsId)
        if (respBody.code === env.RESP_CODE.SUCCESS) {
          this.news = respBody.msg
          this.setSocialShare()
        }
      },
      async getNewsRecommendFromServer () {
        const res = await NewsService.getNewsRecommend(this, this.newsId)
        console.log(res)
        if (res.code === env.RESP_CODE.SUCCESS) {
          this.recommended = res.msg.newses
        }
      },
      async onSaveBtnClick (postData) {
        this.editModalInfo.isSaving = true
        postData.postData.id = this.newsId
        let respBody = await NewsService.update(this, postData.postData)
        let result = false
        if (respBody.code === env.RESP_CODE.SUCCESS) {
          if (postData.img) {
            let updateImgFormData = new FormData()
            updateImgFormData.append('img', postData.img)
            updateImgFormData.append('id', this.newsId)
            respBody = await NewsService.updateImg(this, updateImgFormData)
            if (respBody.code === env.RESP_CODE.SUCCESS) {
              result = true
            }
          }
          result = true
        }
        if (result) {
          toastr.success('更新成功！')
        } else {
          toastr.error('更新失败！')
        }
        this.editModalInfo.isSaving = false
      },

      setSocialShare () {
        window.socialShare('#socialShare', {
          // 这里配置各种参数
          sites: ['weibo', 'wechat', 'twitter'],
          mode: 'prepend',
          url: window.location.href,
          title: env.BRAND_NAME + ' | ' + this.news.title
        })
      }
    },
    computed: {
      htmlContent () {
        if (this.news.content) {
          return marked(this.news.content)
        }
      },
      isLogin () {
        return this.checkLogin()
      }
    },
    watch: {
      news () {
        document.title = env.BRAND_NAME + ' | ' + this.news.title
      },

      $route () {
        this.newsId = this.$route.params.newsId
      },

      newsId () {
        this.getNews()
        this.getNewsRecommendFromServer()
      }
    },
    mounted () {
      this.getNews()
      this.getNewsRecommendFromServer()
    }
  }
</script>

<style lang="scss">
  @import "../../static/css/news.css";
  @import "../../static/css/common";
  @import "../../node_modules/vodal/common.css";
  @import "../../node_modules/vodal/rotate.css";

  .news-detail {
    $largeMargin: 20%;
    $halfMargin: 13%;
    $mobileLargeMargin: 10%;
    $mobileHalfMargin: 8%;

    * {
      font-family: Arial FZLTHJW;
    }
    .main-container {
      position: relative;
    }
    .main-container .edit-btn {
      position: absolute;
      left: 10%;
    }
    .main-container .edit-btn a {
      color: $commonYellow;
    }

    .edit-container {
      overflow: auto;
    }

    .news-wrap {
      margin: 3% 0;

      img {
        display: block;
        margin: 0 auto;
        max-width: 90%;
      }

      .news-margin {
        margin-left: $largeMargin;
        margin-right: $largeMargin;
      }
      .news-float {
        float: left;
        margin-left: $halfMargin;
      }
      .news-main {
        line-height: 24px;
        letter-spacing: .5px;
        inline-size: 800px;
        line-height: 25px;
      }
    }

    .news-wrap a.tag-item {
      color: red;
      border-bottom: 1px solid #F1A9A0;
      cursor: pointer;
    }
    .news-wrap a.tag-item:hover {
      border-bottom: 1px solid red;
    }


    .news-wrap h2, .news-wrap p.news-detail-p {
      margin: 0 0 15px 0;
    }
    .news-wrap p.news-detail-p {
      color: #333;
      font-family: "adobe-caslon-pro",serif;
      font-size: 1.125rem;
      font-weight: 400;
      line-height: 1.5em;
      letter-spacing: normal;
    }

    /* tag */
    .news-wrap .news-tag {
      margin: 0 0 15px 0;
    }
    .news-wrap .news-tag a{
      margin-right: 1%;
      font-family: Nobel,sans-serif;
      font-size: .6875rem;
      line-height: 1em;
      letter-spacing: 0.125em;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-weight: 700;
      text-transform: uppercase;
      color: #c00000;
      text-decoration: none;
    }
    .news-wrap .news-tag a.tag-item:hover {
      border-bottom: 1px solid #c00000;
    }
    /* #tag */

    /* title */
    .news-wrap .news-title {
      font-size: 2.1875rem;
      color: #111;
      font-family: "ITC Caslon",Georgia,serif;
      font-weight: 400;
      line-height: 2.25rem;
      letter-spacing: -0.01em;
      font-variant-ligatures: common-ligatures;
      margin: 15px 0;
      padding-bottom: 10px;
      border-bottom: 1px solid #D2D7D3;
    }

    /* #title */

    /* icon-group */
    .news-wrap .icon-group {
    }
    .news-wrap .icon-group li {
      display: inline-block;
      list-style: none;
      border: 1px solid #EAEAEA;
      margin: 0;
      padding: 15px;
      cursor: pointer;
    }
    .news-wrap .icon-group li.default {
      color: #D2D7D3;
    }
    .news-wrap .icon-group li.blue {
      color: #6BB9F0;
    }
    .news-wrap .icon-group li.red {
      color: #c00000;
    }
    .news-wrap .icon-group li.dark-blue {
      color: #1F3A93;
    }
    .news-wrap .icon-group li.default:hover {
      background: #D2D7D3;
      color: white;
    }
    .news-wrap .icon-group li.blue:hover {
      background: #6BB9F0;
      color: white;
    }
    .news-wrap .icon-group li.red:hover {
      background: #c00000;
      color: white;
    }
    .news-wrap .icon-group li.dark-blue:hover {
      background: #1F3A93;
      color: white;
    }
    /* #icon-group */

    /* main */
    .news-wrap main {
      margin: 20px 0;
    }

    .news-wrap main .news-img {
      text-align: center;
    }
    .news-wrap main .news-img p {
      margin-top: 10px;
      color: #BDBDBD;
      font-family: Nobel,sans-serif;
      font-size: .5625rem;
      line-height: 1em;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    /* #main */

    /* recommended-footer */
    footer {
      background: #F4F4F4;
      padding: 15px 0;
    }
    footer h2.title {
      margin: 10px 3%;
      padding-bottom: 10px;
      border-bottom: 1px dotted #222;
      font-family: Nobel,sans-serif;
      font-size: 1.0375rem;
      line-height: 1em;
      letter-spacing: 0.025em;
      font-weight: bold;
    }
    .recommended-footer {
      display: flex;
      flex-wrap: wrap;
    }
    .recommended-footer .recommended-footer-item {
      margin: 10px 3%;
      cursor: pointer;
    }
    .recommended-footer .recommended-footer-item img {
      width: 100%;
      height: 300px;
      object-fit: cover;
    }
    .recommended-footer .recommended-footer-item:hover img {
      opacity: 0.7;
    }
    /* #recommended-footer */

    @media screen and (min-width: 37.5em) {
      .recommended-footer .recommended-footer-item {
        flex-basis: 38%;
      }
    }
    @media screen and (min-width: 68.75em) {
      .recommended-footer .recommended-footer-item {
        flex-basis: 19%;
      }
    }
    @media screen and (max-width: 780px) {
      .news-wrap {

        .news-margin {
          margin-left: $mobileLargeMargin;
          margin-right: $mobileLargeMargin;
        }
        .news-float {
          float: none;
          margin-top: 12px;
          margin-left: $mobileLargeMargin;
        }
        .news-wrap .news-float{
          float: none;
          margin-left: $mobileLargeMargin;
          margin-right: $mobileLargeMargin;
        }
      }
    }
  }
</style>
