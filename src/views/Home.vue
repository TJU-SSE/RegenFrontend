<template>
  <div class="main">
    <div v-if="isLogin">
      <div class="admin-panel">
        <a class="add-btn" @click="createVodalInfo.show = true" title="创建">
          <i class="fa fa-plus fa-2x"></i>
        </a>
      </div>
      <vodal :show="createVodalInfo.show"
             @hide="createVodalInfo.show = false"
             animation="rotate"
             :height="createVodalInfo.height"
             :width="createVodalInfo.width"
             :measure="createVodalInfo.measure">
        <NewsList :indexItems="backendData" @onAddNewsSaveBtnClick="onAddNewsSaveBtnClick"></NewsList>
      </vodal>
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


    <waterfall
      :line="items.line"
      :line-gap="items.lineGap"
      :min-line-gap="items.minLineGap"
      :max-line-gap="items.maxLineGap"
      :watch="items.data"
      ref="waterfall"
    >
      <WaterfallSlot
        v-for="(item,index) in items.data"
        :width="item.width"
        :height="item.height"
        :order="backendData[item.index].rank"
        :key="item.index"
      >
        <div class="item">
          <!--<p>{{backendData[item.index]}}</p>-->
          <img class="" :src="item.imgUrl" :index="item.index" @click="onItemClick(item.index)">
          <div class="item-info">
            <h4>{{backendData[item.index].news_title}}</h4>
          </div>
        </div>
        <div class="icon-group" v-if="isLogin">
          <a class="minus-btn" @click="onDeleteBtnClick(item.index)"><i class="fa fa-trash fa-lg"></i></a>
          <a class="edit-btn" @click="onUpdateBtnClick(item.index)"><i class="fa fa-edit fa-lg"></i></a>
          <p class="icon-lg">
            <i class="fa fa-line-chart"></i>
            <span>rank: {{backendData[item.index].rank}}</span>
          </p>
        </div>
      </WaterfallSlot>
    </waterfall>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Waterfall from 'vue-waterfall/lib/waterfall'
  import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot'
  import toastr from 'toastr'
  import vodal from 'vodal'

  import IndexService from '@/service/IndexService'
  import env from '@/config/env'

  import NewsList from './admin/components/NewsList.vue'
  import ConfirmVodal from '@/views/components/ConfirmVodal'
  import InputVodal from '@/views/components/InputVodal'

  export default {
    components: {
      Waterfall,
      WaterfallSlot,
      vodal,
      NewsList,
      ConfirmVodal,
      InputVodal
    },
    name: 'index',
    data () {
      return {
        title: env.BRAND_NAME + ' | Home',
        items: {
          minLineGap: 100,
          maxLineGap: 400,
          lineGap: 380,
          line: 'h',
          data: []
        },
        backendData: [],
        createVodalInfo: {
          show: false,
          width: 90,
          height: 90,
          measure: '%'
        },
        confirmVodalText: {
          title: '删除',
          content: '是否删除这条首页信息？',
          extraData: null,
          show: false
        },
        curHeight: 300,
        updateVodalInfo: {
          show: false,
          extraData: null,
          title: '修改',
          content: '更新rank',
          placeholder: 'input rank',
          inputText: null
        }
      }
    },
    methods: {
      ...mapGetters({
        checkLogin: 'checkLogin'
      }),
      async getItems () {
        let respBody = await IndexService.getAll(this)
        if (respBody.code === env.RESP_CODE.SUCCESS) {
          this.backendData = respBody.msg
          this.backendData.forEach((data, index) => {
            let image = new Image()
            image.onload = () => {
              this.items.data.push({
                index: index,
                width: image.width / image.height * this.curHeight,
                height: this.curHeight,
                imgUrl: data.img_url
              })
            }
            image.src = data.img_url
          })
        } else {
          toastr.error('加载数据失败！')
        }
      },
      onItemClick (itemIndex) {
        this.$router.push({
          name: 'newsDetail',
          params: {
            newsId: this.backendData[itemIndex].news_id
          }
        })
      },
      onAddNewsSaveBtnClick (newNewsItem) {
        this.backendData.push(newNewsItem)
        let image = new Image()
        image.onload = () => {
          this.items.data.push({
            index: this.backendData.length - 1,
            width: image.width / image.height * this.curHeight,
            height: this.curHeight,
            imgUrl: newNewsItem.img_url
          })
        }
        image.src = newNewsItem.img_url
      },
      onDeleteBtnClick (index) {
        this.confirmVodalText.show = true
        this.confirmVodalText.extraData = index
      },
      async onConfirmBtnClick (result) {
        if (result.result) {
          let index = result.extraData
          let respBody = await IndexService.delete(this, {
            newsIndexId: this.backendData[index].id
          })
          if (respBody.code === env.RESP_CODE.SUCCESS) {
            for (let itemsIndex in this.items.data) {
              if (this.items.data.hasOwnProperty(itemsIndex) && this.items.data[itemsIndex].index === index) {
                this.items.data.splice(itemsIndex, 1)
                break
              }
            }
            this.backendData.splice(index, 1, {})
            toastr.success('删除成功！')
          } else {
            toastr.error('删除失败！')
          }
        }
        this.confirmVodalText.show = false
      },
      onUpdateBtnClick (index) {
        this.updateVodalInfo.extraData = index
        this.updateVodalInfo.inputText = this.backendData[index].rank
        this.updateVodalInfo.show = true
      },
      async onUpdateVodalConformClick (result) {
        console.log(result)
        if (result.result) {
          let index = result.extraData
          let rank = parseFloat(result.inputText)
          let respBody = await IndexService.update(this, [{
            id: this.backendData[index].id,
            rank: rank
          }])
          if (respBody.code === env.RESP_CODE.SUCCESS) {
            this.backendData[index].rank = rank
            for (let itemIndex in this.items.data) {
              if (this.items.data.hasOwnProperty(itemIndex) && this.items.data[itemIndex].index === index) {
                this.items.data.splice(itemIndex, 1, this.items.data[itemIndex])
                break
              }
            }
            toastr.success('更新成功！')
          } else {
            toastr.error('更细失败！')
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
      this.getItems()
      document.title = this.title
    }
  }
</script>

<style scoped lang="scss">
  @import "../../static/css/common";
  @import "../../node_modules/vodal/common.css";
  @import "../../node_modules/vodal/rotate.css";
  .main {
    margin: 15px 3%;
    position: relative;
  }
  .item {
    position: absolute;
    width: 95%;
    font-size: 1.2em;
    cursor: pointer;

    img {
      width: 100%;
    }

    .item-info {
      display: none;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 3% 5%;
      background: black;
      color: white;
      font-weight: normal;
      opacity: .6;
    }
  }
  .item:hover .item-info {
    display: block;
  }

  .admin-panel {
    position: absolute;
    top: -25px;
    left: 44%;
    z-index: 10;
    width: 50%;

    .add-btn, .edit-btn {
      cursor: pointer;
      margin: 0 3%;
    }
  }

  .icon-group {
    position: absolute;
    right: 8%;
    top: 5%;

    .minus-btn, .edit-btn {
      font-size: 1.5em;
      margin: 5%;
    }

    .icon-lg {
      padding: 5px;
      border-radius: 5px;
      background: #95A5A6;
      font-weight: bold;
    }
  }

</style>
