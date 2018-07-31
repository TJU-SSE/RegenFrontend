<template>
  <div class="regen-container main">
    <h2 class="title">
      {{webTitle}}
      <a class="btn-save" @click="onSaveBtnClick" :class="{'disabled':isSaving}"><i class="fa fa-save"></i></a>
      <span v-if="isSaving" class="hint-msg">保存中 ...</span>
    </h2>
    <div class="form-inline form-group">
      <i class="fa fa-text-height icon"></i>
      <label class="form-label" for="title">Title</label>
      <input type="text" class="form-control form-input" id="title" placeholder="title" v-model="newsData.title">
    </div>

    <div class="form-inline form-group">
      <i class="fa fa-user icon"></i>
      <label class="form-label" for="writer">Writer</label>
      <input type="text" class="form-control form-input" id="writer" placeholder="writer" v-model="newsData.author">
    </div>

    <div class="form-inline form-group">
      <i class="fa fa-calendar icon"></i>
      <label class="form-label" for="time">Time</label>
      <input type="date" class="form-control form-input" id="time" placeholder="time" v-model="newsData.date">
    </div>

    <div class="form-inline form-group">
      <i class="fa fa-tags icon"></i>
      <label class="form-label">Tags</label>
      <Multiselect :options="tags"
                   v-model="newsData.tag"
                   :multiple="true"
                   :hide-selected="true"
                   >
      </Multiselect>
      <button class="form-control btn btn-info" @click="addTagVodalInfo.show = true">创建Tag</button>
      <InputVodal :vodalText="addTagVodalInfo"
                  :inputType="addTagVodalInfo.inputType"
                  @hide="addTagVodalInfo.show = false"
                  @onConfirmBtnClick="onConfirmBtnClick"
                  :show="addTagVodalInfo.show"></InputVodal>
    </div>

    <div class="form-group">
      <i class="fa fa-file-photo-o icon"></i>
      <label class="form-label">Cover</label>
    </div>
    <VueImgInputer theme="light"
                   size="large"
                   :onChange="onFileChange" v-if="!isEditing">
    </VueImgInputer>
    <VueImgInputer theme="light"
                   size="large"
                   :imgSrc="newsData.imgUrl"
                   :onChange="onFileChange" v-if="isEditing">
    </VueImgInputer>


    <!--<div>-->
      <!--<img :src="newsData.imgUrl">-->
    <!--</div>-->

    <div class="content" id="news-editor">
      <h3>Content</h3>
      <vue-u-editor
        @ready="editorReady">
      </vue-u-editor>
    </div>
        <upload-image></upload-image>
  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect'
  import VueImgInputer from 'vue-img-inputer'
  import toastr from 'toastr/build/toastr.min'
  import vueUEditor from 'vue-ueditor'

  import TagService from '@/service/TagService'
  import env from '@/config/env'
  import uploadImage from '../UploadImage.vue'
  import InputVodal from '@/views/components/InputVodal'

  import 'vue-multiselect/dist/vue-multiselect.min.css'
  import 'simplemde-theme-base/dist/simplemde-theme-base.min.css'
  export default {
    props: {
      newsData: {
        default () {
          return {
            title: '',
            author: '',
            date: '',
            content: '',
            img: null,
            tag: null,
            editorInstance: null
          }
        }
      },
      webTitle: {
        default: ''
      },
      isEditing: {
        default: false
      },
      isSaving: {
        default: false
      }
    },
    data () {
      return {
        tags: [],
        addTagVodalInfo: {
          content: '',
          title: '创建Tag',
          placeholder: '输入Tag名称',
          inputText: null,
          show: false,
          inputType: 'text'
        }
      }
    },
    components: {
      Multiselect,
      VueImgInputer,
      InputVodal,
      vueUEditor,
      uploadImage
    },
    methods: {
      editorReady (editorInstance) {
        this.editorInstance = editorInstance
        this.editorInstance.setContent(this.newsData.content)
        this.editorInstance.addListener('contentChange', () => {
          console.log('编辑器内容变化', this.editorInstance.getContent())
          this.newsData.content = this.editorInstance.getContent()
        })
      },
      onNewsContentInput (value) {
        this.newsData.content = value
      },
      onFileChange (file) {
        this.newsData.img = file
      },
      onSaveBtnClick () {
        if (this.isSaving) {
          return
        }
        let postData = null
        if (!this.isEditing) {
          postData = new FormData()
          postData.append('time', Date.parse(new Date(this.newsData.date)))
          for (let tag of this.newsData.tag) {
            postData.append('tags', tag)
          }
          postData.append('writer', this.newsData.author)
          postData.append('content', this.newsData.content)
          postData.append('title', this.newsData.title)
          postData.append('img', this.newsData.img)
          console.log('tag-----', this.newsData.tag)
          this.$emit('onSaveBtnClick', postData)
        } else {
          postData = {
            time: Date.parse(new Date(this.newsData.date)),
            writer: this.newsData.author,
            content: this.newsData.content,
            title: this.newsData.title,
            tags: this.newsData.tag
          }
          console.log('tag-----', this.newsData.tag)
          this.$emit('onSaveBtnClick', {
            postData: postData,
            img: this.newsData.img
          })
        }
      },
      async getTags () {
        let resp = await TagService.getAll(this)
        if (resp.code === env.RESP_CODE.SUCCESS) {
          this.tags = resp.msg
        } else {
          toastr.error('加载tags失败！')
        }
      },
      async onConfirmBtnClick (result) {
        if (result.result) {
          let resp = await TagService.create(this, {
            title: result.inputText
          })
          if (resp.code === env.RESP_CODE.SUCCESS) {
            this.tags.push(resp.msg.title)
            toastr.success('创建tag成功！')
          } else {
            toastr.error('创建tag失败！')
          }
        }
        this.addTagVodalInfo.show = false
      }
    },
    async mounted () {
      await this.getTags()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../static/css/common";
  .main {
    margin: 20px 0;

    h2.title {
      font-size: 2em;
      line-height: 1.5em;
      color: $commonRed;
      border-bottom: 1px solid $borderColor;
      margin-bottom: 20px;

      .btn-save {
        margin-left: 20px;
        color: $commonRedLight;
        font-size: large;
        cursor: pointer;
      }
      .btn-save:hover {
        color: $commonRed;
        font-weight: bold;
      }
      .btn-save.disabled {
        cursor: not-allowed;
      }

      .hint-msg {
        margin-left: 20px;
        font-size: medium;
        color: $commonYellow;
      }
    }

    .icon {
      width: 1.5%;
      min-width: 20px;
    }
    .form-label {
      width: 5%;
      min-width: 50px;
    }
    .form-input, .multiselect {
      z-index: 8;
      width: 40%;
    }

    .form-inline .multiselect {
      display: inline-block;
    }

    .content {
      margin: 20px 0;
    }
  }
</style>
