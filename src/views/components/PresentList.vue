<template>
  <div class="main-container">
    <transition name="slide-fade" v-for="(item, index) in itemList" :key="index">
      <div :class="['list-item', activeItem === index ? 'active':'']"
           class="product-item"
           @mouseover="itemActive(index)"
           @mouseout="activeItem=-1">
        <div class="item-img"
             @click="onItemClick($event,item.id)">
          <img :src="item.imgUrl" alt="pic" :class="[activeItem === index ? 'active':'']">
        </div>
        <div class="item-body"
             @click="onItemClick($event,item.id)">
          <div class="item-body-desc">
            <h4 class="title">{{item.title}}</h4>
            <div class="desc">
              <p>{{item.desc}}</p>
              <p>{{item.time}}</p>
            </div>
          </div>
        </div>
        <div class="edit-container" v-if="isLogin">
          <a @click="onItemEditBtnClick(item)"><i class="fa fa-edit fa-lg edit-btn"></i></a>
          <a @click="onItemDeleteBtnClick(item.id)"><i class="fa fa-trash fa-lg minus-btn"></i></a>
          <p class="rank">
            <i class="fa fa-line-chart fa-lg"></i>
            Ranks: {{item.rank}}
          </p>
          <ConfirmVodal :vodalText="confirmVodalText"
                        :show="confirmVodalText.show"
                        @hide="confirmVodalText.show = false"
                        @onConfirmBtnClick="onConfirmBtnClick"
                        :extraData="confirmVodalText.extraData">
          </ConfirmVodal>
          <InputVodal :vodalText="updateVodalInfo"
                      :show="updateVodalInfo.show"
                      @hide="updateVodalInfo.show = false"
                      @onConfirmBtnClick="onUpdateVodalConformClick"
                      :extraData="updateVodalInfo.extraData">
          </InputVodal>
        </div>

        <div class="hide-list">
          <div :key="index"
               :class="['side-show', activeItem === index ? 'active':'']"
               @mouseover="itemActive(index)"
               @mouseout="activeItem=-1">
            <div class="side-title">
              <h4>{{item.title}}</h4>
              <p>{{item.desc}}</p>
            </div>
            <div class="side-img">
              <div v-if="!curImgList.length" style="margin-left: 10px">
                <i class="fa fa-meh-o" aria-hidden="true"></i>There isn't photos
              </div>
              <div class="side-left" v-if="curImgList.length">
                <img :src="curImgList[0]" alt="pic">
              </div>
              <div class="side-right">
                <img :src="curImg" v-for="curImg,index in curImgList" v-if="index<=5&&index!=0">
              </div>
            </div>
            <div class="side-desc">
              <p>  {{item.desc}}</p>
              <p>  {{item.time}}</p>
            </div>
            <ul class="artist">
            <li v-for="artist in artistData">
                <a @click="onArtistClick(artist.id)">{{artist.name}}</a> - {{getSplitStr(artist.identity)}}
                <i class="fa fa-external-link"></i>
            </li>
        </ul>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import toastr from 'toastr'
  import ProductService from '@/service/ProductService'
  import ArtistProductService from '@/service/ArtistProductService'
  import env from '@/config/env'
  import CommonUtils from '../../config/CommonUtils'
  import ConfirmVodal from '@/views/components/ConfirmVodal'
  import InputVodal from '@/views/components/InputVodal'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        activeItem: -1,
        forSafari: 0,
        imgList: {},
        productId: this.$route.params.showId,
        artistData: [],
        curImgList: [],
        confirmVodalText: {
          title: '删除',
          content: '是否解除这个Product和Artist之间的关联？',
          extraData: null,
          show: false
        },
        updateVodalInfo: {
          show: false,
          extraData: null,
          title: '修改',
          content: '更新rank',
          placeholder: 'input rank',
          inputText: null
        },
        timer: null
      }
    },
    props: {
      itemList: {
        default: ''
      },
      artistId: {
        default: ''
      },
      type: {
        default: env.ARTIST_PRODUCT_TYPES.UPDATES
      }
    },
    components: {
      ConfirmVodal,
      InputVodal
    },
    methods: {
      ...mapGetters({
        checkLogin: 'checkLogin'
      }),
  
      async getData (showId) {
        let respBody = await ProductService.getDetail(this, showId)
        if (respBody.code === env.RESP_CODE.SUCCESS) {
          const artistIdMap = {}
          this.artistData = respBody.msg.artists.filter((artist) => {
            if (!artistIdMap[artist.id]) {
              artistIdMap[artist.id] = true
              return true
            }
            return false
          })
        }
      },
      async initData () {
        let userAgent = navigator.userAgent
        let isSafari = userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') < 1
        console.log('fuck')
        console.log(this.artistData)
        if (isSafari) {
          this.forSafari = this.itemList.length * 140 + 100
        }
      },
      async itemActive (index) {
        console.log('index:')
        console.log()
        await this.getData(this.itemList[index].id)
        if (this.confirmVodalText.show || this.updateVodalInfo.show) {
          this.activeItem = -1
          return
        }

        if (this.timer) {
          window.clearTimeout(this.timer)
        }
        this.timer = window.setTimeout(async () => {
          const itemId = this.itemList[index].id
          if (!this.imgList[itemId]) {
            const respBody = await ProductService.getBrief(this, itemId)
            if (respBody.code === env.RESP_CODE.SUCCESS) {
              this.imgList[itemId] = respBody.msg
            }
          }

          this.curImgList = this.imgList[itemId]
          this.activeItem = index
        }, 150)
      },
      onItemClick ($event, showId) {
        const { href } = this.$router.resolve({
          name: 'showDisplay',
          params: {
            showId: showId
          }
        })
        window.open(href)
      },
      onItemDeleteBtnClick (productId) {
        this.confirmVodalText.extraData = productId
        this.confirmVodalText.show = true
      },
      async onConfirmBtnClick (result) {
        if (result.result) {
          let respBody = await ArtistProductService.delete(this, {
            artistId: this.artistId,
            productId: result.extraData
          }, this.type)
          if (respBody.code === env.RESP_CODE.SUCCESS) {
            toastr.success('删除成功！')
            this.$emit('onDeleteClick')
          } else {
            toastr.error('删除失败！')
          }
        }
        this.confirmVodalText.show = false
      },
      getSplitStr (str) {
        return CommonUtils.getSplitStr(str)
      },
      onItemEditBtnClick (product) {
        this.updateVodalInfo.inputText = product.rank
        this.updateVodalInfo.extraData = product.id
        this.updateVodalInfo.show = true
      },
      async onUpdateVodalConformClick (result) {
        if (result.result) {
          let rank = parseFloat(result.inputText)
          let productId = result.extraData
          let respBody = await ArtistProductService.update(this, {
            artistId: this.artistId,
            products: [
              {
                productId: productId,
                rank: rank
              }
            ]
          }, this.type)
          if (respBody.code === env.RESP_CODE.SUCCESS) {
            this.$emit('onDeleteClick')
            toastr.success('更新成功！')
          } else {
            toastr.error('更新失败！')
          }
        }
        this.updateVodalInfo.show = false
      }
    },
    computed: {
      isLogin () {
        return this.checkLogin()
      }
    },
    mounted () {
      this.initData()
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../static/css/common";
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

  .main-container {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    /*align-items: center;*/
    width: 100%;
    /*height: 100%;*/
  }

  /* list */
  .artist-list {
    border-top: 1px solid $commonGray;
    a {
      color: #827430;
      text-decoration: none;
      line-height: inherit;
    }
    li {
      list-style: no;
    }
  }

  .list-item {
    margin-top: 10px;
    position: relative;
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    align-items: flex-start;
    align-self: flex-start;
    background: white;
    width: 90%;
    transition: 0.5s;
    margin-left: 20px;
    cursor: pointer;
  }

  .item-img {
    margin: 5px;
    width: 200px;
  }

  .item-img > img {
    width: 200px;
    height: 200px;
    object-fit: cover;
    transition: 1s;
  }

  .active img {
    transform: scale(1.05, 1.05);
  }

  .list-item.active {
    background: #E4E4E4;
  }

  .item-body {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 10px;
    opacity: 0.8;
  }

  .item-body-desc {
    text-align: left;
  }

  .item-body-desc .title {
    position: relative;
    margin: 5px 0;
    font-weight: bold;
    color: $commonGolden;
    text-decoration: none;
    transition: 0.5s;
    cursor: pointer;
  }

  .item-body-desc .title:hover {
    padding-left: 40px;
    font-weight: 800;
  }

  .item-body-desc > div {
    margin: 6px 0;
    line-height: 1em;
    overflow-y: auto;
  }

  .item-body-desc > div > p {
    margin: 10px 0;
    font-size: 1.2em;
  }

  /* side show */
  .hide-list {
    position: absolute;
    right: -50%;
    top: 50%;
    //margin-top: -50%;
    transform: translate(0, -50%);
    width: 400px;
    z-index: 100;
  }

  .side-show {
    display: none;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding-bottom: 20px;
  }

  .side-show::before {
    content: '';
    position: absolute;
    left: -19px;
    top: 50%;
    margin-top: -5px;
    border: 10px solid white;
    border-color: transparent white transparent transparent;
    z-index: 200;
  }

  .side-show::after {
    content: '';
    position: absolute;
    left: -20px;
    top: 50%;
    margin-top: -5px;
    border: 10px solid #ccc;
    border-color: transparent #ccc transparent transparent;
    z-index: 199;
  }

  .side-show.active {
    position: static;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .side-title {
    margin: 5px 10px 5px 20px;
    width: 90%;
    /*font-size: 10em;*/
    /*line-height: .7em;*/
    font-weight: 500;
    border-bottom: 1px solid $commonGray;

    h4 {
      margin: 0;
    }

    p {
      margin-bottom: 6px;
    }
  }

  .side-desc {
    border-top: 1px solid $commonGray;
    margin: 20px 20px 5px 20px;
    width: 90%;
  }

  .side-desc h3 {
    margin: 5px 0;
    font-size: 1.5em;
    font-weight: 500;
  }

  .side-desc ul {
    margin: 5px;
  }

  .side-img {
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    align-items: flex-start;
    flex-wrap: wrap;
    /*height: 200px;*/
    margin-left: 10px;
  }
  .side-left > img {
    width: 150px;
    height: auto;
    /*max-height: 400px;*/
    margin-left: 10px;
    margin-top: 6px;
  }

  .side-right {
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    margin-left: 20px;
    width: 200px;
    /*height: 200px;*/
  }

  .side-right > img {
    width: 80px;
    /*height: auto;*/
    margin-right: 5px;
    margin-top: 6px;
  }

  .side-right > a {
    position: absolute;
    bottom: 100px;
    right: 10px;
    color: #0088f5;
    margin-top: 40px;
    font-size: 1.5em;
  }

  .product-item {
    position: relative;
    .edit-container {
      position: absolute;
      left: -80px;
      top: 25%;
      z-index: 10;
      font-size: 1.5em;
      .rank {
        margin-left: -20px;
        font-size: .7em;
      }
    }
  }

  @media screen and (max-width: 1000px){
    .side-show {
      display: none !important;
    }
  }

  @media screen and (min-width: 1500px){
    .list-item {
      width: 100%;
    }

    .hide-list {
      right: 150px;
    }
  }

  @media screen and (max-width: 780px) {
    .list-item {
      width: 100%;
      margin-left: 0;
      .item-img {
        width: 150px;
        img {
          width: 150px;
          height: 150px;

          object-fit: cover;
        }
      }
    }
  }

</style>
