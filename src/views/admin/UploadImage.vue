<template>
  <div class="send-twitter">
    <div class="bottom">

      <div class="word-count">
        <span v-if="progress && progress - 100">
          <span class="sep">|</span>
          图片上传进度 {{progress}}%</span>
      </div>
      <div class="btns">
      </div>
    </div>
            <el-upload 
        :show-file-list="false"
        :file-list="fileList"
        :action="action" 
        :data="{ token: token() }"
        :on-success="handleSuccess"
        :on-progress="handleProgress"
        >
        <el-button type="primary" size="small">{{ dialogImageUrl ? '再上传一张' : '添加' }}图片</el-button>
        </el-upload>
    <p>提示：插入图片 {{this.imgEle}}</p>
  </div>
</template>

<script>

import {token, action, domain} from '../../plugins/qiniuToken'

export default {
  name: 'sendtwitter',
  data () {
    return {
      textarea: '',
      dialogImageUrl: '',
      fileList: [],
      dialogVisible: false,
      token,
      action,
      domain,
      progress: 0,
      imgEle: ''
    }
  },
  computed: {
    wordCount () {
      return this.textarea.length
    }
  },
  methods: {
    emit () {
      if (!this.textarea) {
        return
      }
      this.$emit('send', Object.assign({},
        this.dialogImageUrl ? {
          img: this.dialogImageUrl
        } : {},
        this.textarea ? {content: this.textarea} : {}))
      this.reset()
    },
    reset () {
      this.textarea = ''
      this.dialogImageUrl = ''
      this.fileList = []
      this.progress = 0
    },
    handleProgress (event, file, fileList) {
      this.progress = parseInt(event.percent)
    },
    handleSuccess (response, file, fileList) {
      // console.log(response, file, fileList)
      this.progress = 100
      this.dialogImageUrl = this.domain + response.hash
      this.imgEle = '<img src="' + this.dialogImageUrl + '">'
      this.$message({
        message: '图片上传成功~',
        type: 'success'
      })
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

<style>
  .withImg textarea {
    border-radius: 4px 4px 0 0;
  }
</style>

<style lang="scss" scoped>
  .send-twitter {
    display: flex;
    flex-direction: column;
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }
  .word-count {
    opacity: .5;
    font-size: 12px;
    margin: 0 15px;
  }
  .el-button {
    margin-left: 5px;
  }
  .preview {
    width: 100%;
    border: 1px solid #dcdfe6;
    border-top: 0;
    box-sizing: border-box;
    border-radius: 0 0 4px 4px;
  }
  .sep {
    margin: 0 10px;
  }
</style>
