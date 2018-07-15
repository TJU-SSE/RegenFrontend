<template>
  <div>
    <div>
      <!-- swiper -->
      <swiper :options="swiperOption">
        <swiper-slide v-for="(slide, index) in swiperSlides" :key="index">
          <div class="slide-item">
            <img :src="slide.url" :alt="slide.desc" @click="selectPic(index)">
            <div v-if="isLogin">
              <a class="minus-btn" @click="onDeleteImgClick(slide.id)"><i class="fa fa-trash fa-lg"></i></a>
            </div>
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
      </swiper>
    </div>
    <ConfirmVodal :vodalText="confirmVodalText"
                  :show="confirmVodalText.show"
                  @hide="confirmVodalText.show = false"
                  @onConfirmBtnClick="onConfirmDeleteBtnClick"
                  :extraData="confirmVodalText.extraData">
    </ConfirmVodal>
  </div>
</template>

<script>
  import toastr from 'toastr'
  import { mapGetters } from 'vuex'
  import ConfirmVodal from '@/views/components/ConfirmVodal'

  import ProductService from '@/service/ProductService'
  import env from '@/config/env'
  export default {
    data () {
      return {
        swiperOption: {
          pagination: '.swiper-pagination',
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          slidesPerView: 3,
          centeredSlides: true,
          paginationClickable: true,
          spaceBetween: 30
        },
        confirmVodalText: {
          title: '删除',
          content: '是否删除这张图片？',
          extraData: null,
          show: false
        }
      }
    },
    props: ['swiperSlides', 'productId'],
    components: {
      ConfirmVodal
    },
    methods: {
      ...mapGetters({
        checkLogin: 'checkLogin'
      }),
      selectPic (index) {
        this.$emit('selectPic', index)
      },
      onDeleteImgClick (imgId) {
        this.confirmVodalText.extraData = imgId
        this.confirmVodalText.show = true
      },
      async onConfirmDeleteBtnClick (result) {
        if (result) {
          let respBody = await ProductService.deleteImg(this, {
            id: this.productId,
            img_id: result.extraData
          })
          if (respBody.code === env.RESP_CODE.SUCCESS) {
            for (let index in this.swiperSlides) {
              if (this.swiperSlides.hasOwnProperty(index) && this.swiperSlides[index].id === result.extraData) {
                this.swiperSlides.splice(index, 1)
                break
              }
            }
            toastr.success('删除成功！')
          } else {
            toastr.error('删除失败')
          }
        }
        this.confirmVodalText.show = false
      }
    },
    computed: {
      isLogin () {
        return this.checkLogin()
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../static/css/common";
  .swiper-container {
    background-color: #FFF;
  }

  .append-buttons {
    text-align: center;
    margin-top: 20px;
  }
  .append-buttons a {
    display: inline-block;
    margin: 0 10px;
  }

  .swiper-wrapper > div {
    width: auto !important;
  }

  .swiper-slide img {
    height: 100px;
    width: auto !important;
    cursor: pointer;
  }

  .swiper-button-prev {
    background-size: 15px;
  }

  .swiper-button-next {
    background-size: 15px;
  }

  .slide-item {
    position: relative;
    .minus-btn {
      position: absolute;
      top: 5px;
      right: 5px;
      font-size: 1.2em;
    }
  }
</style>
