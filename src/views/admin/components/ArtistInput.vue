<template>
  <div>
    <vodal :show="vodalInfo.show"
           @hide="hide"
           :width="vodalInfo.width"
           :height="vodalInfo.height"
           :measure="vodalInfo.measure"
           animation="rotate">
      <h3>{{title}}</h3>

      <div class="form-horizontal">
        <div class="form-group">
          <label for="nameInput" class="col-sm-2 control-label">Name</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" id="nameInput" placeholder="Name" v-model="createData.name">
          </div>
        </div>

        <div class="form-group">
          <label for="roleInput" class="col-sm-2 control-label">身份</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" id="roleInput" placeholder="Name" v-model="createData.biography.role">
          </div>
        </div>

        <div class="form-group">
          <label for="identitySelect" class="col-sm-2 control-label">Identity</label>
          <div class="col-sm-4">
            <select id="identitySelect" v-model="createData.firstMenu" class="form-control">
              <option value="0">一级目录</option>
              <option v-for="value,key in secondMenus" :value="key">{{key}}</option>
            </select>
          </div>
          <div class="col-sm-4">
            <select id="identitySelect2" v-model="createData.identity" class="form-control">
              <option value="0">二级目录</option>
              <option v-for="secondMenu in secondMenus[createData.firstMenu]" :value="secondMenu">{{secondMenu}}</option>
            </select>
          </div>
        </div>
        <EditSelectTable :inputData="createData.social" :title="socialTitle"></EditSelectTable>
        <EditTable :inputData="createData.address" :title="addressTitle"></EditTable>
        <EditTable :inputData="createData.extraBiography" :title="extraBiographyTitle"></EditTable>
        <EditTable :inputData="createData.biography.content" :title="biographyTitle"></EditTable>

        <div class="form-group">
          <label class="col-sm-2 control-label">Desc</label>
          <div class="col-sm-8">
            <markdownEditor
              :value="createData.biography.desc"
              @input="onNewsContentInput"
              :custom-theme="true"
              ref="markdownEditorRef">
            </markdownEditor>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">Product List</label>
          <div class="col-sm-8">
            <markdownEditor
              :value="createData.biography.products"
              @input="onProductsInput"
              :custom-theme="true"
              ref="markdownEditorRef">
            </markdownEditor>
          </div>
        </div>
        <EditTable :inputData="createData.biography.personInfo" :title="personInfoTitle"></EditTable>
        <div class="form-group">
          <label for="nameInput" class="col-sm-2 control-label">Cover</label>
          <div class="col-sm-8">
            <VueImgInputer :onChange="onFileChange" max-size='102400' :imgSrc="createData.img_url"></VueImgInputer>
          </div>
        </div>
      </div>

      <footer class="confirm-btn-group">
        <button class="btn btn-success" @click="onConfirmBtnClick(true)" :class="{'disabled': vodalInfo.isSaving}">确定</button>
        <button class="btn btn-danger" @click="onConfirmBtnClick(false)">取消</button>
        <span v-if="vodalInfo.isSaving">保存中....</span>
      </footer>
    </vodal>
  </div>
</template>

<script>
  import { markdownEditor } from 'vue-simplemde'
  import toastr from 'toastr'
  import VueImgInputer from 'vue-img-inputer'
  import Vodal from '../../../../node_modules/vodal/src/Vodal'

  import EditTable from './EditTable.vue'
  import EditSelectTable from './EditSelectTable.vue'

  import env from '@/config/env'

  import 'vue-multiselect/dist/vue-multiselect.min.css'
  import 'simplemde-theme-base/dist/simplemde-theme-base.min.css'
  export default {
    props: {
      vodalInfo: {
        default () {
          return {
            show: false,
            isSaving: false,
            width: 70,
            height: 90,
            measure: '%'
          }
        }
      },
      createData: {
        default () {
          return {
            name: '',
            firstMenu: 0,
            identity: 0,
            social: [],
            address: [],
            extraBiography: [],
            biography: {
              content: [],
              desc: '',
              personInfo: [],
              role: ''
            },
            img: null
          }
        }
      },
      title: {
        default: '创建Artist'
      }
    },
    data () {
      return {
        socialTitle: 'Social',
        addressTitle: 'Address',
        extraBiographyTitle: 'ExtraBiography',
        personInfoTitle: 'Person Info',
        biographyTitle: 'Biography'
      }
    },
    components: {
      EditTable,
      VueImgInputer,
      Vodal,
      markdownEditor,
      EditSelectTable
    },
    computed: {
      secondMenus () {
        return env.SECOND_MENU_TITLE
      }
    },
    methods: {
      hide () {
        this.$emit('hide')
      },
      onSocialAddBtnClick () {
        this.createData.social.push({
          key: 'key' + this.createData.curSocialSum,
          value: 'value' + this.createData.curSocialSum
        })
        this.createData.curSocialSum ++
      },
      onSocialDeleteBtnClick (deleteItem) {
        for (let index = 0; index < this.createData.social.length; index++) {
          if (this.createData.social[index] === deleteItem) {
            this.createData.social.splice(index, 1)
            break
          }
        }
      },
      onFileChange (file) {
        this.createData.img = file
      },
      onConfirmBtnClick (result) {
        let data = null
        let img = null
        if (result) {
          if (!this.checkInputValid()) {
            toastr.error('Name和Identity不能为空！')
            return
          }
          this.vodalInfo.isSaving = true
          data = this.createData
          img = this.createData.img
        }
        this.createData = {
          name: '',
          firstMenu: 0,
          identity: 0,
          social: [],
          address: [],
          extraBiography: [],
          biography: {},
          img: null
        }
        this.$emit('onConfirmBtnClick', {
          result: result,
          data: data,
          img: img
        })
      },
      checkInputValid () {
        return !(this.createData.name === '' || this.createData.identity === 0)
      },
      onNewsContentInput (value) {
        this.createData.biography.desc = value
      },
      onProductsInput (value) {
        this.createData.biography.products = value
      }
    }
  }
</script>

<style scoped lang="scss">
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
  .multiselect {
    z-index: 100;
  }
</style>
