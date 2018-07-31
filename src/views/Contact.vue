<template>
  <div class="regen-container main-container">
    <div class="edit-container" v-if="isLogin">
      <a @click="onEditBtnClick"><i class="fa fa-edit fa-lg edit-btn"></i></a>
      <vodal :show="editModalInfo.show"
             :mask="editModalInfo.mask"
             :width="editModalInfo.width"
             :height="editModalInfo.height"
             :measure="editModalInfo.measure"
             animation="rotate"
             @hide="editModalInfo.show = false">
        <h3>Update Contact Information</h3>
        <div class="form-horizontal">
          <div v-for="index in editModalInfo.inputData.length" :key="index">
            <div class="form-group" v-for="curField in editModalInfo.autoInput" :key="curField">
              <label :for="'input'+curField" class="col-sm-2 control-label">{{curField}}</label>
              <div class="col-sm-8">
                <input type="text"
                      class="form-control"
                      :id="'input'+curField"
                      :placeholder="'input ' + curField"
                      v-model="editModalInfo.inputData[index-1][curField]">
              </div>
            </div>
            <EditSelectTable :inputData="editModalInfo.inputData[index-1]['social']" :title="'Social'"></EditSelectTable>
            <div class="form-group" v-if="index===2">
              <label class="col-sm-2 control-label">Description</label>
              <div class="col-sm-8">
                <vue-u-editor
                  @ready="editorReady">
                </vue-u-editor>
              </div>
            </div>
          </div>
        </div>
        <footer class="confirm-btn-group">
          <button class="btn btn-success"
                  @click="onConfirmBtnClick(true)"
                  :class="{'disabled': editModalInfo.isSaving}">确定</button>
          <button class="btn btn-danger" @click="onConfirmBtnClick(false)">取消</button>
          <span v-if="editModalInfo.isSaving">保存中...</span>
        </footer>
      </vodal>
    </div>
    <main>
      <div v-html="descMarkdown" class="common-markdown"></div>

      <div class="photos">
        <div class="edit-container" v-if="isLogin">
          <a @click="workerModalInfo.show = true"><i class="fa fa-plus fa-lg add-btn"></i></a>
          <WorkerInput :show="workerModalInfo.show"
                       :title="workerModalInfo.title"
                       @hide="workerModalInfo.show = false"
                       @onConfirmBtnClick="onCreateWorkerConfirmBtnClick"></WorkerInput>
        </div>
        <div v-for="(photo,index) in photos" :key="index" class="photos-item">

          <img :src="photo.img_url" alt="p.name">
          <div class="edit-container-parent">
            <p>{{photo.name}}</p>
            <div class="edit-container" v-if="isLogin">
              <a @click="onWorkerEditBtnClick(index)"><i class="fa fa-edit fa-lg edit-btn"></i></a>
              <a @click="onWorkerDeleteBtnClick(photo.id)"><i class="fa fa-trash fa-lg minus-btn"></i></a>
              <p class="rank"><i class="fa fa-line-chart fa-lg"></i>
                Rank: {{photo.rank}}</p>

              <ConfirmVodal :vodalText="confirmVodalText"
                            :show="confirmVodalText.show"
                            @hide="confirmVodalText.show = false"
                            @onConfirmBtnClick="onWorkerDeleteConfirmBtnClick"
                            :extraData="confirmVodalText.extraData">
              </ConfirmVodal>
              <WorkerInput :show="editWorkerModalInfo.show"
                           :title="editWorkerModalInfo.title"
                           @hide="editWorkerModalInfo.show = false"
                           :workerData="editWorkerModalInfo.workerData "
                           @onConfirmBtnClick="onEditWorkerConfirmBtnClick"></WorkerInput>
            </div>
          </div>
          <p><i>{{photo.identity}}</i></p>
          <p class="email">{{photo.email}}</p>
        </div>
      </div>
      <div class="contact">
        <h4>业务咨询、简历投递 请留下您的联系方式</h4>
        <h4>Please leave your contact details here for coopertaion or work opportunity</h4>
        <el-form :model="contactForm" :rules="rules" ref="contactForm">
          <el-form-item label="姓名 Name" prop="name">
            <el-input v-model="contactForm.name"></el-input>
          </el-form-item>
          <el-form-item label="邮箱 Email" prop="email">
            <el-input v-model="contactForm.email"></el-input>
          </el-form-item>
          <el-form-item label="内容 Content" prop="content">
            <el-input type="textarea" v-model="contactForm.content" :rows="4"></el-input>
          </el-form-item>
          <el-form-item label="验证码 Verification Code" prop="verificationCode">
            <el-input v-model="contactForm.verificationCode"></el-input>
            <div class="code" @click="setValidate">
                <s-identify :identifyCode="identifyCode"></s-identify>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button @click="contactSubmit">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <Pagination :pageInfo="pageInfo" @onPageChange="onPageChange"></Pagination>
    </main>
    <nav>
      <h3 class="city">| {{contactData[0].city_name}} |</h3>
      <div class="map">
        <iframe width='400' height='450' frameborder='0' scrolling='no' marginheight='0' marginwidth='0' src='http://f.amap.com/5J74C_0715iY8'></iframe>
      </div>
      <div class="contacts">
        <div>
          <p>Tel: +{{contactData[0].phone}}</p>
        </div>
        <div>
          <p>Add:</p>
        </div>
        <div>
          <p>{{contactData[0].address}}</p>
        </div>
      </div>
      <h3 class="city">| {{contactData[1].city_name}} |</h3>
      <div class="map">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d155.1613737864298!2d-0.09867483611529332!3d51.52088464416027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761b56bb5bfb43%3A0xfc22c89f43faecfc!2sFlorin+Court!5e0!3m2!1szh-CN!2sus!4v1531817952877" width='400' height='450' frameborder='0' scrolling='no' marginheight='0' marginwidth='0'></iframe>
      </div>
      <div class="contacts">
        <div>
          <p>Tel: +{{contactData[1].phone}}</p>
        </div>
        <div>
          <p>Add:</p>
        </div>
        <div>
          <p>{{contactData[1].address}}</p>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import toastr from 'toastr'
  import marked from 'marked'
  import Vodal from 'vodal'
  import { markdownEditor } from 'vue-simplemde'
  import vueUEditor from 'vue-ueditor'

  import 'vue-multiselect/dist/vue-multiselect.min.css'
  import 'simplemde-theme-base/dist/simplemde-theme-base.min.css'

  import Pagination from './components/PaginationV2.vue'
  import WorkerInput from './admin/components/WorkerInput.vue'
  import ConfirmVodal from '@/views/components/ConfirmVodal'
  import EditSelectTable from './admin/components/EditSelectTable'
  import SIdentify from '@/views/components/identify'

  import ContactService from '@/service/ContactService'
  import env from '@/config/env'
  export default {
    data () {
      var checkImage = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'))
          return
        } else if (value !== this.identifyCode) {
          callback(new Error('验证码错误'))
          this.setValidate()
          return
        } else {
          callback()
        }
      }
      return {
        identifyCode: '',
        editorInstance: null,
        contactData: [
          {
            desc: '',
            id: 1,
            phone: '',
            photography: '',
            fax: '',
            address: '',
            link: '',
            social: [],
            city_name: ''
          },
          {
            desc: '',
            id: 2,
            phone: '',
            photography: '',
            fax: '',
            address: '',
            link: '',
            social: [],
            city_name: ''
          }
        ],
        contactForm: {
          name: '',
          email: '',
          content: '',
          verificationCode: ''
        },
        rules: {
          name: [
            {required: true, message: '这是一个必填项哦', trigger: 'blur'}
          ],
          content: [
            {required: true, message: '这是一个必填项哦', trigger: 'blur'}
          ],
          verificationCode: [
            {required: true, trigger: 'blur', validator: checkImage}
          ]
        },
        title: env.BRAND_NAME + ' | 联系我们',
        pageInfo: {
          totalPages: 0,
          curPageNum: 1,
          pageGroupSum: env.PAGE_GROUP_SUM
        },
        photos: [],
        editModalInfo: {
          show: false,
          mask: true,
          width: 85,
          height: 90,
          measure: '%',
          inputData: [
            {
              city_name: '',
              phone: '',
              photography: '',
              fax: '',
              address: '',
              link: '',
              social: [],
              desc: ''
            },
            {
              city_name: '',
              phone: '',
              photography: '',
              fax: '',
              address: '',
              link: '',
              social: [],
              desc: ''
            }
          ],
          isSaving: false,
          autoInput: ['city_name', 'phone', 'photography', 'fax', 'address', 'link']
        },
        workerModalInfo: {
          show: false,
          title: '创建员工'
        },
        editWorkerModalInfo: {
          show: false,
          title: '更新员工',
          workerData: {
            img: null,
            name: '',
            email: '',
            rank: 1,
            identity: '',
            img_url: ''
          }
        },
        confirmVodalText: {
          title: '删除',
          content: '是否删除这名员工？',
          extraData: null,
          show: false
        }
      }
    },
    methods: {
      setValidate () {
        const rand = ('' + parseInt((1 + Math.random()) * Math.PI * 10000)).slice(-4)
        this.identifyCode = rand
      },
      editorReady (editorInstance) {
        this.editorInstance = editorInstance
        this.editorInstance.addListener('contentChange', () => {
          console.log('编辑器内容变化', this.editorInstance.getContent())
          this.editModalInfo.inputData[0].desc = this.editorInstance.getContent()
          this.editModalInfo.inputData[1].desc = this.editorInstance.getContent()
        })
      },
      contactSubmit () {
        this.$refs.contactForm.validate(async (valid) => {
          if (valid) {
            let respBody = await ContactService.sendContactForm(this, {
              name: this.contactForm.name,
              email: this.contactForm.email,
              content: this.contactForm.content
            })
            if (respBody.code === env.RESP_CODE.SUCCESS) {
              this.$message({
                message: '提交成功，请等待工作人员与您联系',
                type: 'success'
              })
            } else {
              this.$message({
                message: '出现错误，请重试',
                type: 'error'
              })
            }
          } else {
            this.$message({
              message: '出现错误，请重试',
              type: 'error'
            })
            return false
          }
        })
        this.setValidate()
      },
      ...mapGetters({
        checkLogin: 'checkLogin'
      }),
      async getDetail () {
        let respBody = await ContactService.get(this)
        if (respBody.code === env.RESP_CODE.SUCCESS) {
          this.contactData = respBody.msg
        }
      },
      async getWorkers (newCurPageNum) {
        let respBody = await ContactService.getAllWorkers(this, newCurPageNum)
        if (respBody.code === env.RESP_CODE.SUCCESS) {
          this.photos = respBody.msg.workers
          this.pageInfo.totalPages = Math.ceil(respBody.msg.total / respBody.msg.itemSize)
          this.pageInfo.curPageNum = newCurPageNum
        }
      },

      async getAllContactInfo () {
        let respBody = await ContactService.getAllContactInfo(this)
        if (respBody.code === env.RESP_CODE.SUCCESS) {
          this.contactData = respBody.msg
          this.contactData[0].social = JSON.parse(this.contactData[0].social)
          this.contactData[1].social = JSON.parse(this.contactData[1].social)
          console.log('联系', this.contactData)
        }
      },
      onPageChange (newCurPageNum) {
        this.getWorkers(newCurPageNum)
      },
      onDescInput (value) {
        this.editModalInfo.inputData[0].desc = value
        this.editModalInfo.inputData[1].desc = value
        this.editorInstance.setContent(value)
      },
      onEditBtnClick () {
        this.editModalInfo.inputData = JSON.parse(JSON.stringify(this.contactData))
        this.editorInstance.setContent(this.editModalInfo.inputData[0].desc)
        this.editModalInfo.show = true
      },
      async onConfirmBtnClick (result) {
        if (result) {
          let respBody = await ContactService.updateAll(this, this.editModalInfo.inputData)
          if (respBody.code === env.RESP_CODE.SUCCESS) {
            this.contactData = this.editModalInfo.inputData
            toastr.success('更新数据成功！')
          } else {
            toastr.error('更新数据失败！')
          }
        }
        this.editModalInfo.show = false
      },
      async onCreateWorkerConfirmBtnClick (result) {
        if (result.result) {
          let respBody = await ContactService.createWorker(this, result.data)
          if (respBody.code === env.RESP_CODE.SUCCESS) {
            toastr.success('创建员工成功！')
            this.getWorkers(this.pageInfo.curPageNum)
          } else {
            toastr.error('创建员工失败！')
          }
        }
        this.workerModalInfo.show = false
      },
      onWorkerDeleteBtnClick (workerId) {
        this.confirmVodalText.extraData = workerId
        this.confirmVodalText.show = true
      },
      async onWorkerDeleteConfirmBtnClick (result) {
        if (result.result) {
          let respBody = await ContactService.deleteWorker(this, {
            id: result.extraData
          })
          if (respBody.code === env.RESP_CODE.SUCCESS) {
            this.getWorkers(this.pageInfo.curPageNum)
            toastr.success('删除员工成功！')
          } else {
            toastr.error('删除员工失败！')
          }
        }
        this.confirmVodalText.show = false
      },
      onWorkerEditBtnClick (photoIndex) {
        this.editWorkerModalInfo.workerData = JSON.parse(JSON.stringify(this.photos[photoIndex]))
        this.editWorkerModalInfo.show = true
      },
      async onEditWorkerConfirmBtnClick (result) {
        if (result.result) {
          let respBody = await ContactService.updateWorker(this, {
            id: result.data.id,
            name: result.data.name,
            email: result.data.email,
            identity: result.data.identity,
            rank: result.data.rank
          })
          if (respBody.code === env.RESP_CODE.SUCCESS) {
            toastr.success('更新员工信息成功！')
            if (result.data.img) {
              console.log('img', result.data.id)
              let respBody = await ContactService.updateWorkerImg(this, {
                id: result.data.id,
                img: result.data.img
              })
              if (respBody.code === env.RESP_CODE.SUCCESS) {
                toastr.success('更新员工图片成功！')
              } else {
                toastr.error('更新员工图片失败！')
              }
            }
            this.getWorkers(this.pageInfo.curPageNum)
          } else {
            toastr.error('更新员工信息失败！')
          }
        }
        this.editWorkerModalInfo.show = false
      }
    },
    computed: {
      descMarkdown () {
        return marked(this.contactData[0].desc)
      },
      isLogin () {
        return this.checkLogin()
      }
    },
    components: {
      Pagination,
      Vodal,
      markdownEditor,
      WorkerInput,
      ConfirmVodal,
      EditSelectTable,
      SIdentify,
      vueUEditor
    },
    mounted () {
      document.title = this.title
      this.getAllContactInfo()
      this.getWorkers(1)
      this.setValidate()
    }
  }
</script>

<style lang="scss" scoped="">
  @import "../../static/css/common";
  @import "../../node_modules/vodal/common.css";
  @import "../../node_modules/vodal/rotate.css";
  /*.contact-container {*/
  * {
    font-family: Arial FZLTHJW;
  }
  .main-container {
    display: flex;
    position: relative;
    padding-top: 20px;
    .edit-container {
      position: absolute;
      left: 45%;
      top: 0;
    }
    .edit-container-parent {
      position: relative;
    }
  }

  .map > img {
    max-width: 300px;
    margin-left: 25px;
  }

  .city {
    font-size: 28px;
    color: #c5181f;
    padding-left: 130px;
  }

  .contact {
    padding-top: 100px;
  }
  /* main */
  .main-container main {
    padding-right: 3%;
    border-right: 1px solid #222222;
    flex: 2.5;
  }

  .main-container main .photos {
    display: flex;
    flex-wrap: wrap;
    /*justify-content: space-between;*/
    justify-content: flex-start;
  }

  .main-container main .photos .photos-item {
    width: 28%;
    padding: 10px 0;
    margin: 0 1%;
    cursor: pointer;
  }
  .main-container main .photos img:hover {
    opacity: .7;
  }
  .main-container main .photos img {
    width: 100%;
  }
  .main-container main .photos p.email {
    font-size: 1.2em;
  }
  .main-container main .photos p {
    line-height: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .main-container .photos {
    position: relative;
    .photos-item {
      position: relative;
      .edit-container {
        position: absolute;
        left: 60%;
        top: 20px;
        .rank {
          padding: 8px;
          background: $commonGray*1.5;
          font-size: 1em;
        }
      }
    }
    .edit-container {
      position: absolute;
      left: 45%;
      top: -10px;
    }
  }
  /* #main */

  /* nav */
  .main-container nav {
    padding-left: 3%;
    flex: 1;
  }

  .main-container nav, .main-container nav p {
    font-size: 1.1em;
  }

  .main-container nav .contacts {
  }
  .main-container nav .contacts .contacts-item {
    display: flex;
    flex-wrap: wrap;
  }
  .main-container nav .contacts .contacts-item strong {
    flex: 1;
    padding-right: 3%;
  }
  .main-container nav .contacts .contacts-item p {
    flex: 2;
    margin-bottom: 5px;
  }

  .main-container nav  img.img-location {
    width: 90%;
    margin-bottom: 15px;
  }

  .main-container nav .location p, .main-container nav .icon-group a i{
    color: #95A5A6;
  }
  .main-container nav .location p:first-child {
    margin: 10px 0 0 0;
  }
  .main-container nav .location p:last-child {
    margin: 0 0 20px 0;
  }

  .main-container nav .links a {
    text-decoration: none;
    color: #111;
  }

  .main-container nav .icon-group {
    margin: 20px 0;
  }
  .main-container nav .icon-group a {
    margin-right: 3%;
  }
  .main-container nav .icon-group a:hover i{
    /*color: #111;*/
    font-weight: bold;
  }
  /* #nav */

  p {
    font-family:  Georgia, serif;
    font-weight: lighter;
    letter-spacing: 0.02em;
    font-size: 1.5em;
    line-height: 135%;
    margin-top: -0.3em;
    margin-bottom: 1em;
    color: #111;
  }

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

  .code {
    margin: 10px 0px 0 0px;
  }

  @media screen and (max-width: 720px) {
    .main-container main .photos .photos-item {
      width: 90%;
    }
    .main-container {
      flex-direction: column;
      main {
        border-right: none;

        img {
          max-width: 100%;
        }
      }
      nav {
        padding-top: 15px;
        border-bottom: 1px solid $commonGray;
      }
    }
  }
</style>
