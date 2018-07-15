<template>
  <div>
    <vodal :show="show"
           @hide="hide"
           :width="vodalInfo.width"
           :height="vodalInfo.height"
           :measure="vodalInfo.measure"
           animation="rotate">
      <h3>{{title}}</h3>
      <div class="form-horizontal">
        <div class="form-group">
          <label for="inputTitle" class="col-sm-2 control-label">Title</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" id="inputTitle"
                   placeholder="Title" v-model="productData.title">
          </div>
        </div>
        <div class="form-group">
          <label for="inputSession" class="col-sm-2 control-label">Session</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" id="inputSession"
                   placeholder="Session" v-model="productData.session">
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">Release Time</label>
          <div class="col-sm-8">
            <Calendar @change="onDateChange"
                      :year="productData.releaseTime.year"
                      :month="productData.releaseTime.month"
                      :day="productData.releaseTime.day"></Calendar>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">Description</label>
          <div class="col-sm-8">
            <markdownEditor
              :value="productData.introduction.desc"
              @input="onNewsContentInput"
              :custom-theme="true"
              ref="markdownEditorRef">
            </markdownEditor>
          </div>
        </div>
        <div class="form-group">
          <label for="inputVideoUrl" class="col-sm-2 control-label">Video Link</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" id="inputVideoUrl"
                   placeholder="Source" v-model="productData.introduction.videoUrl">
          </div>
        </div>
        <div class="form-group">
          <label for="inputSource" class="col-sm-2 control-label">Source</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" id="inputSource"
                   placeholder="Source" v-model="productData.introduction.source">
          </div>
        </div>
        <div class="form-group">
          <label for="inputClient" class="col-sm-2 control-label">Client</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" id="inputClient"
                   placeholder="Client" v-model="productData.introduction.client">
          </div>
        </div>
        <div class="form-group">
          <label for="inputWeibo" class="col-sm-2 control-label">Weibo</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" id="inputWeibo"
                   placeholder="Weibo" v-model="productData.introduction.weibo">
          </div>
        </div>
        <div class="form-group">
          <label for="inputFacebook" class="col-sm-2 control-label">Facebook</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" id="inputFacebook"
                   placeholder="Facebook" v-model="productData.introduction.facebook">
          </div>
        </div>

        <div class="form-group">
          <label for="inputFacebook" class="col-sm-2 control-label">Tags</label>
          <div class="col-sm-8">
            <Multiselect :options="tags"
                         v-model="productData.tags"
                         :multiple="true"
                         :hide-selected="true"
            >
            </Multiselect>
          </div>
        </div>

        <EditTable :inputData="productData.introduction.artists" :title="'Artists'"></EditTable>

        <div class="form-group">
          <label class="col-sm-2 control-label">Cover</label>
          <div class="col-sm-8">
            <VueImgInputer :onChange="onFileChange" :imgSrc="productData.img_url"></VueImgInputer>
          </div>
        </div>
      </div>
      <footer class="confirm-btn-group">
        <button class="btn btn-success" @click="onConfirmBtnClick(true)">确定</button>
        <button class="btn btn-danger" @click="onConfirmBtnClick(false)">取消</button>
      </footer>
    </vodal>
  </div>
</template>

<script>
  import { markdownEditor } from 'vue-simplemde'
  import VueImgInputer from 'vue-img-inputer'
  import Vodal from 'vodal'
  import Multiselect from 'vue-multiselect'

  import EditTable from './EditTable.vue'
  import Calendar from '../../components/Calendar'
  import CommonUtils from '../../../config/CommonUtils'

  import TagService from '@/service/TagService'
  import env from '@/config/env'

  import 'vue-multiselect/dist/vue-multiselect.min.css'
  import 'simplemde-theme-base/dist/simplemde-theme-base.min.css'

  import '../../../../node_modules/vodal/common.css'
  import '../../../../node_modules/vodal/rotate.css'

  export default {
    props: {
      productData: {
        default () {
          return {
            img: null,
            title: '',
            session: '',
            releaseTime: {
              year: CommonUtils.getCurYear(),
              month: 0,
              day: 0
            },
            introduction: {
              videoUrl: '',
              desc: '',
              source: '',
              client: '',
              weibo: '',
              facebook: '',
              artists: []
            },
            tags: []
          }
        }
      },
      vodalInfo: {
        default () {
          return {
            width: 70,
            height: 90,
            measure: '%'
          }
        }
      },
      title: {
        default: ''
      },
      show: {
        default: false
      }
    },
    data () {
      return {
        tags: []
      }
    },
    components: {
      VueImgInputer,
      Vodal,
      markdownEditor,
      EditTable,
      Calendar,
      Multiselect
    },
    methods: {
      hide () {
        this.$emit('hide')
      },
      onConfirmBtnClick (result) {
        let data = null
        if (result) {
          data = this.productData
        }
        this.$emit('onConfirmBtnClick', {
          result: result,
          data: data
        })
      },
      onFileChange (file) {
        this.productData.img = file
      },
      onNewsContentInput (value) {
        this.productData.introduction.desc = value
      },
      onDateChange (date) {
        this.productData.releaseTime = date
      },
      async getTagsFromServer () {
        const resp = await TagService.getAll(this)
        if (resp.code === env.RESP_CODE.SUCCESS) {
          this.tags = resp.msg
        }
      }
    },
    mounted () {
      this.getTagsFromServer()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../static/css/common";
  h3 {
    line-height: 2em;
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

</style>
