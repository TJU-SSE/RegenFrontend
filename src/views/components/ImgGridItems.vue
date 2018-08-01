<template>

  <div  class="img-grid">
    <div v-for="item in imgGridItems"
          v-if="isLogin | item.display"
         class="img-grid-item"
         :key="item.designerId">
      <div class="img-container">
        <i class="img-occur"></i>
        <img :src="item.imgUrl" :alt="item.title" @click="onItemClick(item)">
      </div>
      <h2 @click="onItemClick(item)">{{item.title}}</h2>
      <p @click="onItemClick(item)">{{item.desc}}</p>

      <div class="edit-container" v-if="isLogin">
        <a class="minus-btn" @click="onDeleteBtnClick(item.designerId)"><i class="fa fa-trash fa-lg"></i></a>
      </div>

      <ConfirmVodal v-if="isLogin"
                    :vodalText="confirmVodalText"
                    :show="confirmVodalText.show"
                    @hide="confirmVodalText.show = false"
                    @onConfirmBtnClick="onConfirmBtnClick"
                    :extraData="confirmVodalText.extraData">
      </ConfirmVodal>
    </div>
  </div>

</template>

<script>
  import { mapGetters } from 'vuex'
  import toastr from 'toastr'
  import ConfirmVodal from '@/views/components/ConfirmVodal'
  import ArtistService from '@/service/ArtistService'
  import env from '@/config/env'
  import objectFit from 'object-fit'
  export default {
    name: 'news',
    data () {
      return {
        confirmVodalText: {
          title: '删除',
          content: '是否删除该位Artist？',
          extraData: null,
          show: false
        }
      }
    },
    props: {
      imgGridItems: {
        default: []
      }
    },
    components: {
      ConfirmVodal
    },
    methods: {
      ...mapGetters({
        checkLogin: 'checkLogin'
      }),
      onItemClick (item) {
        this.$router.push({
          name: 'portfolio',
          params: {designerId: item.designerId}
        })
      },
      async onDeleteBtnClick (itemId) {
        this.confirmVodalText.show = true
        this.confirmVodalText.extraData = itemId
      },
      async onConfirmBtnClick (result) {
        if (result.result) {
          let respBody = await ArtistService.delete(this, {
            id: result.extraData
          })
          if (respBody.code === env.RESP_CODE.SUCCESS) {
            for (let index in this.imgGridItems) {
              if (this.imgGridItems.hasOwnProperty(index) && this.imgGridItems[index].designerId === result.extraData) {
                this.imgGridItems.splice(index, 1)
                break
              }
            }
            toastr.success('删除成功！')
          } else {
            toastr.error('删除失败！')
          }
        }

        this.confirmVodalText.show = false
      }
    },
    computed: {
      isLogin () {
        return this.checkLogin()
      }
    },
    mounted () {
      objectFit.polyfill({
        selector: 'img', // this can be any CSS selector
        fittype: 'cover', // either contain, cover, fill or none
        disableCrossDomain: 'true' // either 'true' or 'false' to not parse external CSS files.
      })
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../static/css/common";
  /* img-grid */
  .img-grid {
    display: flex;
    flex-wrap: wrap;
  }

  /** img-grid-item **/
  .img-grid .img-grid-item {
    width: 30.3%;
    padding: 3% 3% 0 3%;
  }

  .img-grid .img-grid-item .img-container {
    position: relative;
    width: 100%;
  }
  .img-container .img-occur {
    display: block;
    padding-bottom: 130%;
  }

  .img-grid .img-grid-item img, .img-grid .img-grid-item h2, .img-grid .img-grid-item p {
    cursor: pointer;
  }

  .img-grid .img-grid-item img {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .img-grid .img-grid-item h2 {
    font-size: large;
    font-weight: bold;
    margin: 8px 0 0 0;
  }
  /** #img-grid-item **/

  /* #img-grid */

  .img-grid-item{
    position: relative;
    .edit-container {
      position: absolute;
      right: 15%;
      top: 15%;
      font-size: 1.5em;
    }
  }

  @media screen and (max-width: 780px) {
    .img-grid .img-grid-item {
      width: 90%;
    }
  }
</style>
