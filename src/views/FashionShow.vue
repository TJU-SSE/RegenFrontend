<template>
  <div class="main-container">
    <div class="edit-container" v-if="isLogin">
      <a title="创建Artist" @click="createVodalInfo.show = true"><i class="fa fa-plus fa-lg add-btn"></i></a>
    </div>
    <p class="regen-container msg-container" v-if="!imgGridItems.length">什么都没有 ...</p>
    <ImgGridItems :imgGridItems="imgGridItems"></ImgGridItems>
    <div class="regen-container">
      <Pagination :pageInfo="pageInfo" @onPageChange="onPageChange"></Pagination>
    </div>
    <p class="hidden">{{secondMenuCom}}</p>

    <ArtistInput v-if="isLogin"
                 @onConfirmBtnClick="onCreateConfirmBtnClick"
                 :vodalInfo="createVodalInfo"
                 @hide="createVodalInfo.show = false">
    </ArtistInput>

  </div>
</template>

<script>
  import toastr from 'toastr'
  import { mapGetters } from 'vuex'

  import ArtistService from '@/service/ArtistService'
  import env from '@/config/env'

  import ImgGridItems from './components/ImgGridItems.vue'
  import Pagination from '@/views/components/PaginationV2'
  import ArtistInput from '@/views/admin/components/ArtistInput'
  import Vodal from '../../node_modules/vodal/src/Vodal'

  export default {
    data: function () {
      return {
        imgGridItems: [],
        secondMenu: this.$route.params.secondMenu,
        title: env.BRAND_NAME + ' | ' + this.$route.params.secondMenu.toLocaleUpperCase(),
        pageInfo: {
          totalPages: 0,
          curPageNum: 1,
          pageGroupSum: env.PAGE_GROUP_SUM
        },
        createVodalInfo: {
          show: false,
          width: 70,
          height: 90,
          measure: '%',
          isSaving: false
        }
      }
    },
    components: {
      Vodal,
      ImgGridItems,
      Pagination,
      ArtistInput
    },
    methods: {
      ...mapGetters({
        checkLogin: 'checkLogin'
      }),
      async getImgGridItems (newCurPageNum) {
        let respBody = await ArtistService.getAllByIdentity(this, {
          identity: this.secondMenu,
          pageOffset: newCurPageNum
        })
        if (respBody.code === env.RESP_CODE.SUCCESS) {
          this.imgGridItems = respBody.msg.artists
          this.pageInfo.totalPages = Math.ceil(respBody.msg.total / respBody.msg.itemSize)
          this.pageInfo.curPageNum = newCurPageNum
          if (!this.isLogin &&
            env.SECOND_MENU_DIRECT_TO_THIRD.indexOf(this.secondMenu) !== -1 && this.imgGridItems.length) {
            this.$router.push({
              name: 'portfolio',
              params: {
                designerId: this.imgGridItems[0].designerId
              }
            })
          }
        } else {
          toastr.error('加载数据失败！')
        }
      },
      onPageChange (newCurPageNum) {
        this.getImgGridItems(newCurPageNum)
      },
      async onCreateConfirmBtnClick (result) {
        if (result.result) {
          let respBody = await ArtistService.create(this, result.data)
          if (respBody.code === env.RESP_CODE.SUCCESS) {
            this.getImgGridItems(this.pageInfo.curPageNum)
            this.createVodalInfo.isSaving = false
            toastr.success('创建成功！')
          } else {
            toastr.error('创建失败')
            console.log('failed', respBody)
          }
        }
        this.createVodalInfo.show = false
      }
    },
    mounted () {
      document.title = this.title
      this.getImgGridItems(1)
    },
    computed: {
      secondMenuCom: function () {
        this.secondMenu = this.$route.params.secondMenu
        this.title = env.BRAND_NAME + ' | ' + this.secondMenu.toLocaleUpperCase()
        document.title = this.title
        this.getImgGridItems(1)
        return this.$route.params.secondMenu
      },
      isLogin () {
        return this.checkLogin()
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../static/css/common";
  .main-container {
    position: relative;
    padding-top: 12px;
    .msg-container {
      padding: 3%;
    }
    .edit-container {
      position: absolute;
      top: 5px;
      left: calc(50% - 1.5em / 2);
      z-index: 10;
      font-size: 1.5em;
    }
  }
</style>
