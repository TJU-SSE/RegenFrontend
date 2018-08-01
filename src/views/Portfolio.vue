<template>
  <div class="main-container">
    <div class="edit-container" v-if="isLogin">
      <a @click="onEditVodalBtnClick"><i class="fa fa-edit fa-lg edit-btn icon"></i></a>
    </div>
    <div class="left">
      <h2>{{designerData.name}}</h2>
      <div class="detail">
        <img
          :src="designerData.img_url"
          :alt="designerData.name"
          class="photo"
        >
        <p>{{designerData.biography.role || designerData.identity.toLocaleUpperCase()}}</p>
        <div class="side-biography">
          <ul v-if="designerData.identity.toLocaleUpperCase() !== 'TALENT'">
            <li v-for="value,index in designerData.extraBiography">{{value.key}}: {{value.value}}</li>
          </ul>
          <div v-if="designerData.identity.toLocaleUpperCase() === 'TALENT'">
            <p class="talent-item-title">Agencies</p>
            <div v-for="value in designerData.extraBiography" class="talent-item">
              <p class="talent-item-key">{{value.key}}:</p>
              <p class="talent-item-value">{{value.value}}</p>
            </div>
          </div>
          <div class="side-edit-container" v-if="isLogin">
            <a @click="onMultiInputEditClick(designerData.extraBiography, '更新侧边栏信息')"><i class="fa fa-edit fa-lg edit-btn"></i></a>
          </div>
          <MultiplyInputVodal v-if="isLogin"
                              :show="multiInputVodalInfo.show"
                              @hide="multiInputVodalInfo.show = false"
                              :vodalText="multiInputVodalInfo.text"
                              @onConfirmBtnClick="onMultiVodalConfirmClick">
          </MultiplyInputVodal>
        </div>
        <div class="icons">
          <a :href="socialItem.value" v-for="socialItem in designerData.social" target="_blank">
            <i class="fa" :class="'fa-' + socialItem.key"></i>
          </a>
        </div>
      </div>
    </div>
    <div class="right">
      <Biograph :biography="designerData.biography"
                :artistId="designerId"
                @onPersonInfoEditClick="onMultiInputEditClick(designerData.biography.personInfo, '更新个人信息')">
      </Biograph>
      <div class="top" @click="onToTopBtnClick">
        <p>TOP</p>
      </div>
    </div>

    <ArtistInput v-if="isLogin && editVodal.vodalData"
                 @onConfirmBtnClick="onCreateConfirmBtnClick"
                 :vodalInfo="editVodal.info"
                 @hide="editVodal.info.show = false"
                 :title="editVodal.title"
                 :createData="editVodal.vodalData">
    </ArtistInput>
  </div>
</template>

<script>
  import $ from 'jquery'
  import toastr from 'toastr'
  import { mapGetters } from 'vuex'

  import Biograph from './components/Biography.vue'
  import MultiplyInputVodal from '@/views/components/MultiplyInputVodal'
  import ArtistInput from '@/views/admin/components/ArtistInput'

  import ArtistService from '@/service/ArtistService'
  import env from '@/config/env'

  export default {
    data () {
      return {
        title: env.BRAND_NAME + ' | 艺术家',
        designerId: this.$route.params.designerId,
        designerData: {
          id: 0,
          name: '',
          identity: '',
          social: [],
          address: [],
          dispaly: true,
          extraBiography: [],
          biography: {},
          img_url: ''
        },
        multiInputVodalInfo: {
          show: false,
          text: {
            title: '更新侧边栏信息',
            content: '',
            inputTexts: {}
          }
        },
        editVodal: {
          info: {
            show: false,
            width: 70,
            height: 90,
            measure: '%',
            isSaving: false
          },
          title: '更新Artist信息',
          vodalData: null
        }
      }
    },
    components: {
      Biograph,
      MultiplyInputVodal,
      ArtistInput
    },
    methods: {
      ...mapGetters({
        checkLogin: 'checkLogin'
      }),
      onToTopBtnClick () {
        $(document.body).animate({'scrollTop': 0}, 500)
      },
      async getData () {
        let respBody = await ArtistService.getDetailById(this, this.designerId)
        if (respBody.code === env.RESP_CODE.SUCCESS) {
          this.designerData = respBody.msg
        }
      },
      onMultiInputEditClick (refData, title) {
        this.multiInputVodalInfo.text.originTexts = refData.map((biography) => {
          return Object.assign({}, biography)
        })
        this.multiInputVodalInfo.text.title = title
        this.multiInputVodalInfo.text.inputTexts = refData
        this.multiInputVodalInfo.show = true
      },
      async onMultiVodalConfirmClick (data) {
        if (data.result) {
          let respBody = await ArtistService.update(this, this.designerData)
          if (respBody.code === env.RESP_CODE.SUCCESS) {
            toastr.success('更新成功！')
          } else {
            toastr.error('更新失败！')
          }
        }
      },
      onEditVodalBtnClick () {
        this.designerData.firstMenu = env.SECOND_MENU_TITLE.fashionShow.indexOf(this.designerData.identity) === -1
          ? 'photography' : 'fashionShow'
        this.editVodal.vodalData = JSON.parse(JSON.stringify(this.designerData))
        console.log('this.editVodal.vodalData', this.editVodal.vodalData)
        this.editVodal.info.show = true
      },
      async onCreateConfirmBtnClick (result) {
        if (result.result) {
          result.data.id = this.designerData.id
          let respBody = await ArtistService.update(this, result.data)
          if (respBody.code === env.RESP_CODE.SUCCESS) {
            this.designerData = result.data
            toastr.success('更新文本成功！')
            console.log(result)
            if (result.img) {
              respBody = await ArtistService.updateImg(this, {
                id: this.designerData.id,
                img: result.img
              })
              if (respBody.code === env.RESP_CODE.SUCCESS) {
                this.designerData.img_url = respBody.msg
                toastr.success('更新封面成功！')
              } else {
                toastr.error('更新封面失败！')
              }
            }
            this.editVodal.info.isSaving = false
            this.editVodal.info.show = false
          } else {
            toastr.error('更新文本失败！')
          }
        }
      }
    },
    computed: {
      isLogin () {
        return this.checkLogin()
      }
    },
    mounted () {
      document.title = this.title
      this.getData()
    }
  }
</script>

<style scoped lang="scss">
  @import "../../static/css/common";
  * {
    font-family: Arial FZLTHJW;
  }
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
    flex-direction: row;
    align-items: flex-start;
    width: 80%;
    margin: 20px auto;
  }

  /* left */
  .left {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    align-items: center;
    width: 30%;
  }

  .detail {
    border-left: 1px solid $commonGray;
    border-right: 1px solid $commonGray;
    width: 90%;
    text-align: center;
  }

  .detail p {
    font-size: 1.5em;
    font-weight: 500;
    margin-top: 10px;
  }

  .detail img {
    width: 100%;
    height: auto;
  }

  .detail ul {
    margin-top: 20px;
  }

  .detail li {
    font-weight: 500;
    margin-bottom: 5px;
  }

  .icons {
    color: black;
  }
  .icons a {
    margin: 0 1%;
    font-size: 1.5em;
    color: black;
  }
  .icons a:hover {
    color: $commonGray;
  }

  /* right */
  .right {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    align-items: center;
    width: 55%;
  }

  .top {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #42495B;
    color: white;
    text-align: center;
    position: fixed;
    bottom: 2%;
    right: 5%;
    cursor: pointer;
    z-index: 200000;
  }

  .top p {
    margin-top: 10px;
  }

  .photo {
    cursor: pointer;
  }

  .side-biography {
    position: relative;
    width: 100%;
  }
  .side-biography ul{
    /*margin-left: 35%;*/
    list-style: none;
  }
  .side-biography .side-edit-container {
    position: absolute;
    top: 20px;
    left: 20%;
  }

  .main-container {
    position: relative;
    .edit-container {
      position: absolute;
      left: calc(50% - 2em / 2);
      .icon {
        font-size: 2em;
      }
    }
  }

  .talent-item-title {
    padding: 0 18px;
    text-align: left;
    font-size: 18px;
    font-weight: bold;
  }
  .talent-item {
    text-align: left;
    padding: 0 24px;
    .talent-item-value, .talent-item-key {
      font-size: 16px;
      padding: 0;
      margin: 0;
    }
    .talent-item-key {
      color: #827430;
    }
    .talent-item-value {
      margin-bottom: 6px;
    }
  }

  @media screen and (max-width: 780px) {
    .main-container {
      flex-direction: column;

      .left {
        width: 100%;
        .detail {
          width: 100%;
        }
      }
      .right {;
        width: 100%;
      }
    }
  }
</style>
