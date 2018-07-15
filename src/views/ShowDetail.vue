<template>
  <div :class="['main-container', isSafari ? 'sa-main-container':'']" class="my-main-container show-detail-container">
    <div v-if="isLogin">
      <a @click="onEditBtnClick"><i class="fa fa-edit fa-lg edit-btn"></i></a>
      <ProductInput :show="editVodalInfo.show"
                    @hide="editVodalInfo.show = false"
                    :title="editVodalInfo.title"
                    @onConfirmBtnClick="onConfirmBtnClick"
                    :productData="editVodalInfo.refData"></ProductInput>
    </div>
    <div class="left">
      <div class="info">
        <h4>{{productData.title}}</h4>
        <h4>{{productData.session}}</h4>
        <div class="social-item">
          <!-- <a><i class="fa fa-weibo fa-lg"></i></a>
           <a><i class="fa fa-facebook fa-lg"></i></a>-->
        </div>
        <p v-if="productData.introduction">client: <a>{{productData.introduction.client}}</a></p>
        <p v-if="productData.introduction">source: <a>{{productData.introduction.source}}</a></p>
        <p>
          published: {{getDateStrFromOBj(productData.releaseTime)}}
        </p>
        <p>Tags: {{tagsText}}</p>
      </div>
      <div class="single-page-view">
        <p>Single Page View</p>
      </div>
      <div class="info">
        <h4>All people in this show</h4>
        <ul class="artist">
          <li v-for="artist in artistData">
            <a @click="onArtistClick(artist.id)">{{artist.name}}</a> - {{getSplitStr(artist.identity)}}
            <i class="fa fa-external-link"></i>
          </li>
          <li v-for="artist in productData.introduction.artists"><a>{{artist.key}}</a> - {{artist.value}}</li>
        </ul>
      </div>
    </div>
    <div class="right">
      <div class="edit-container" v-if="isLogin">
        <a @click="addImgVodalInfo.show = true"><i class="fa fa-plus fa-lg add-btn"></i></a>
        <vodal :show="addImgVodalInfo.show"
               @hide="addImgVodalInfo.show = false"
               :width="addImgVodalInfo.width"
               :height="addImgVodalInfo.height"
               :measure="addImgVodalInfo.measure">
          <div class="vodal-container">
            <h3 class="vodal-title">添加图片</h3>

            <el-upload
              action=""
              class="upload-demo"
              :on-change="handleImgRemove"
              :on-remove="handleImgRemove"
              list-type="picture"
              :auto-upload="false"
              multiple
            >
              <el-button size="small" type="primary">点击添加</el-button>
            </el-upload>

            <!--<VueImgInputer @onChange="onAddImgChange"></VueImgInputer>-->
            <footer class="confirm-btn-group">
              <el-button
                type="primary"
                :loading="addImgVodalInfo.loading"
                @click="onAddImgConfirmBtnClick(true)"
              >
                确定
              </el-button>
              <button class="btn btn-danger" @click="onAddImgConfirmBtnClick(false)">取消</button>
            </footer>
          </div>
        </vodal>
      </div>
      <div class="swiper">
        <Swiper :swiperSlides="seasons" :productId="productId" @selectPic="changePic"></Swiper>
      </div>
      <transition name="slide-fade">
        <div class="lg-img" v-if="forChange">
          <img v-if="curImg" :src="curImg.url" :alt="curImg.name">
          <div class="img-desc common-markdown" v-html="imgDesc"></div>
        </div>
      </transition>
      <iframe
        width="560"
        height="315"
        :src="productData.introduction.videoUrl"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
      >
      </iframe>
    </div>
    <div class="hidden">{{productIdCom}}</div>
  </div>
</template>

<script>
  /* eslint-disable */
  import { mapGetters } from 'vuex'
  import toastr from 'toastr'
  import Swiper from './components/Swiper.vue'
  import Vodal from 'vodal'
  import marked from 'marked'

  import CommonUtils from '../config/CommonUtils'

  import ProductInput from '@/views/admin/components/ProductInput'
  import VueImgInputer from 'vue-img-inputer'

  import ProductService from '@/service/ProductService'
  import env from '@/config/env'

  export default {
    data () {
      return {
        productId: this.$route.params.showId,
        title: env.BRAND_NAME + ' | 案例',
        artistData: [],
        productData: {
          id: 16,
          img_url: '',
          imgs: [],
          rank: -1,
          releaseTime: {
            year: 1970,
            month: 1,
            day: 1
          },
          session: '',
          title: '',
          introduction: {
            desc: '',
            source: '',
            client: '',
            weibo: '',
            facebook: ''
          },
          tags: []
        },
        seasons: [],
        curImg: {},
        isSafari: false,
        forChange: true,
        editVodalInfo: {
          title: '更新Product',
          show: false,
          refData: {
            img: null,
            title: '',
            session: '',
            releaseTime: '',
            introduction: {
              desc: '',
              source: '',
              client: '',
              weibo: '',
              facebook: '',
              artists: []
            }
          }
        },
        addImgVodalInfo: {
          show: false,
          width: 80,
          height: 45,
          measure: '%',
          img: null,
          imgs: [],
          loading: false
        }
      }
    },
    components: {
      Swiper,
      ProductInput,
      Vodal,
      VueImgInputer
    },
    methods: {
      ...mapGetters({
        checkLogin: 'checkLogin'
      }),
      changePic (index) {
        this.forChange = false
        this.curImg = this.seasons[index]
        setTimeout(() => this.forChange = true, 500)
      },
      async getData () {
        let respBody = await ProductService.getDetail(this, this.productId)
        if (respBody.code === env.RESP_CODE.SUCCESS) {
          const artistIdMap = {}
          this.artistData = respBody.msg.artists.filter((artist) => {
            if (!artistIdMap[artist.id]) {
              artistIdMap[artist.id] = true
              return true
            }
            return false
          })

          respBody.msg.artists.forEach((artist) => {
            artistIdMap[artist.id] = true
          })

          this.productData = respBody.msg.product
          this.seasons = respBody.msg.product.imgs.map((img, index) => {
            return {
              url: img.img_url,
              id: img.img_id
            }
          })
        }
      },
      async onConfirmBtnClick (result) {
        console.log(result)
        if (result.result) {
          let respBody = await ProductService.update(this, {
            id: this.productId,
            title: result.data.title,
            session: result.data.session,
            releaseTime: result.data.releaseTime,
            introduction: result.data.introduction,
            tags: result.data.tags
          })
          if (respBody.code === env.RESP_CODE.SUCCESS) {
            this.productData.title = result.data.title
            this.productData.session = result.data.session
            this.productData.releaseTime = result.data.releaseTime
            this.productData.introduction = result.data.introduction
            toastr.success('更新文本成功！')
            if (result.data.img) {
              respBody = await ProductService.updateImg(this, {
                id: this.productId,
                img: result.data.img
              })
              if (respBody.code === env.RESP_CODE.SUCCESS) {
                this.productData.img_url = respBody.msg
                toastr.success('更新封面成功！')
              } else {
                toastr.error('更新封面失败！')
              }
            }
          } else {
            toastr.error('更新文本失败！')
          }
        }
        this.editVodalInfo.show = false
      },
      onEditBtnClick () {
        this.editVodalInfo.refData = JSON.parse(JSON.stringify(this.productData))
        this.editVodalInfo.show = true
      },
      onAddImgChange (file) {
        console.log(file)
        this.addImgVodalInfo.img = file
      },
      handleImgRemove (file, fileList) {
        this.addImgVodalInfo.imgs = fileList
      },
      async onAddImgConfirmBtnClick (result) {
        if (result && this.addImgVodalInfo.imgs) {
          this.addImgVodalInfo.loading = true
          const respBody = await ProductService.addImgs(this, {
            id: this.productId,
            imgs: this.addImgVodalInfo.imgs.map(item => item.raw)
          })
          if (respBody.code === env.RESP_CODE.SUCCESS) {
            this.init()
            toastr.success('添加图片成功！')
          } else {
            toastr.error('添加图片失败！')
          }
        }
        this.addImgVodalInfo.img = null
        this.addImgVodalInfo.show = false
        this.addImgVodalInfo.loading = false
      },
      onArtistClick (artistId) {
        this.$router.push({
          name: 'portfolio',
          params: {
            designerId: artistId
          }
        })
      },
      getDateStrFromOBj (obj) {
        return CommonUtils.getDateStrFromOBj(obj)
      },
      getSplitStr (str) {
        return CommonUtils.getSplitStr(str)
      },
      async init () {
        document.title = this.title
        let userAgent = navigator.userAgent
        this.isSafari = userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') < 1

        await this.getData()
        if (this.seasons.length >= 0) {
          this.curImg = this.seasons[0]
        }
      }
    },
    mounted () {
      this.init()
    },
    computed: {
      isLogin () {
        return this.checkLogin()
      },

      imgDesc () {
        if (this.productData.introduction.desc) {
          return marked(this.productData.introduction.desc)
        }
        return null
      },

      productIdCom () {
        this.productId = this.$route.params.showId
        this.init()
        return this.$route.params.showId
      },

      tagsText () {
        return this.productData.tags.join(' | ')
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../static/css/common";
  @import "../../node_modules/vodal/common.css";
  @import "../../node_modules/vodal/rotate.css";
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-active {
    transform: translateX(10px);
    opacity: 0;
  }

  .sa-main-container {
    min-height: 800px !important;
  }

  .main-container {
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    align-items: flex-start;
    width: 90%;
    margin: 20px auto;
    height: 100%;
  }

  a {
    color: #827430;
    text-decoration: none;
    line-height: inherit;
  }

  /* left */
  .left {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    align-items: center;
    width: 40%;
  }

  .info {
    background: #f2f2f2;
    padding: 1.25rem;
    width: 60%;
  }

  .info h3, h4 {
    line-height: 1;
    margin-bottom: 0.626rem;
  }

  .social-item {
    margin: 8px 0;
  }
  .social-item a {
    display: inline-block;
  }

  .info li {
    line-height: 1.2rem;
  }

  .single-page-view {
    width: 60%;
    height: 30px;
    background: #ccc;
    padding: 0.1rem 1.25rem;
    margin-bottom: 1.25rem;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    align-items: center;
  }

  .single-page-view > p {
    padding-top: 5px;
  }

  /* right */
  .right {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    align-items: center;
    width: 60%;
  }

  /* swiper */
  .swiper {
    width: 100%;
  }

  .video-url {
    display: inline-block;
    width: 90%;
    max-width: 600px;

    img {
      width: 100%;
    }
  }

  /* lg-img */
  .lg-img {
    width: 100%;
    display: flex;
    display: -webkit-flex;
    /*border-top: 1px solid gray;*/
    flex-direction: column;
    align-items: center;
    margin: 0.5rem;
  }

  .lg-img img {
    width: 90%;
    max-width: 600px;
    border: 1px solid gray;
    border-bottom: transparent;
  }

  .name {
    padding: 0;
    margin: 0;
    text-align: left;
    border: 1px solid #d8d8d8;
    border-top: transparent;
    background: #FFF;
    width: 90%;
  }

  .name p {
    padding: 1.25rem;
    display: block;
  }

  .artist {
    margin: 0;
    list-style: none;
  }
  .artist li {
    margin: 5px 0;
  }

  .right {
    position: relative;
    .edit-container {
      position: absolute;
      left: -35px;
      top: 0;
    }

    .img-desc {
      margin: 10px 0;
    }
  }
  .vodal-container {
    h3 {
      line-height: 1.5em;
      border-bottom: 1px solid $commonGray;
    }
    footer {
      padding-top: 10px;
      border-top: 1px solid $commonGray;
    }
    .confirm-btn-group {
      margin-top: 4%;
    }
    .confirm-btn-group button {
      width: 35%;
      max-width: 100px;
    }
  }

  @media screen and (max-width: 720px) {
    .main-container {
      flex-direction: column;

      .left {
        width: 100%;
        .info {
          width: 90%;
        }
        .single-page-view {
          width: 90%;
        }
      }
      .right {
        margin-top: 30px;
        width: 100%;
      }
    }
  }
</style>
