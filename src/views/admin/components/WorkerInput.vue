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
        <div class="form-group" v-for="autoInput in autoInputs">
          <label :for="'input'+autoInput" class="col-sm-2 control-label">{{autoInput}}</label>
          <div class="col-sm-8">
            <input type="text" class="form-control" :id="'input'+autoInput"
                   :placeholder="autoInput" v-model="workerData[autoInput]">
          </div>
        </div>

        <div class="form-group">
          <label class="col-sm-2 control-label">Cover</label>
          <div class="col-sm-8">
            <VueImgInputer :onChange="onFileChange" :imgSrc="workerData.img_url"></VueImgInputer>
            <p>{{this.workerData.img_url}}</p>
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

  import EditTable from './EditTable.vue'

  import 'vue-multiselect/dist/vue-multiselect.min.css'
  import 'simplemde-theme-base/dist/simplemde-theme-base.min.css'

  export default {
    props: {
      workerData: {
        default () {
          return {
            img: null,
            name: '',
            email: '',
            rank: 1,
            identity: '',
            img_url: ''
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
        autoInputs: ['name', 'email', 'identity', 'rank']
      }
    },
    components: {
      VueImgInputer,
      Vodal,
      markdownEditor,
      EditTable
    },
    methods: {
      hide () {
        this.$emit('hide')
      },
      onConfirmBtnClick (result) {
        let data = null
        if (result) {
          data = this.workerData
        }
        this.$emit('onConfirmBtnClick', {
          result: result,
          data: data
        })
      },
      onFileChange (file) {
        this.workerData.img = file
      },
      onNewsContentInput (value) {
        this.workerData.introduction.desc = value
      }
    },
    mounted () {
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../node_modules/vodal/common.css";
  @import "../../../../node_modules/vodal/rotate.css";
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
