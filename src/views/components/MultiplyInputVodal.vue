<template>
  <vodal :show="show"
         @hide="hide"
         animation="rotate"
         :height="vodalInfo.height"
         :width="vodalInfo.width"
         :measure="vodalInfo.measure">
    <div class="main">
      <h3>
        <span>{{vodalText.title}}</span>
        <a class="add-btn" @click="onAddBtnClick"><i class="fa fa-plus"></i></a>
      </h3>
      <table class="table table-striped table-bordered table-hover">
        <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
          <th>Option</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="value,index in vodalText.inputTexts">
          <td class="table-row-medium">
            <input type="text" class="form-control" v-model="value.key">
          </td>
          <td class="table-row-lg">
            <input type="text" class="form-control" v-model="value.value">
          </td>
          <td class="table-row-sm">
            <a class="col-sm-2 icon" @click="onDeleteBtnClick(index)">
              <i class="fa fa-close fa-lg minus-btn"></i>
            </a>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="confirm-btn-group">
      <button class="btn btn-success" @click="onConfirmBtnClick(true)">确定</button>
      <button class="btn btn-danger" @click="onConfirmBtnClick(false)">取消</button>
    </div>

  </vodal>
</template>

<script>
  import vodal from 'vodal'
  import CommonUtils from '@/config/CommonUtils'
  export default {
    props: {
      show: {
        default: false
      },
      vodalInfo: {
        default () {
          return {
            height: 80,
            width: 40,
            measure: '%'
          }
        }
      },
      vodalText: {
        default () {
          return {
            title: '',
            inputTexts: [],
            originTexts: []
          }
        }
      },
      extraData: {
        default: null
      }
    },
    data () {
      return {
        createInputSum: 1
      }
    },
    methods: {
      hide (result = false) {
        if (!result) {
          CommonUtils.emptyArray(this.vodalText.inputTexts)
          this.vodalText.originTexts.forEach((originText) => {
            this.vodalText.inputTexts.push(originText)
          })
        }
        this.$emit('hide')
      },
      onConfirmBtnClick (result) {
        this.hide(result)
        this.$emit('onConfirmBtnClick', {
          result: result,
          inputText: this.vodalText.inputText,
          extraData: this.extraData
        })
      },
      onDeleteBtnClick (index) {
        this.vodalText.inputTexts.splice(index, 1)
      },
      onAddBtnClick () {
        this.vodalText.inputTexts.push({
          key: 'key' + this.createInputSum,
          value: 'value' + this.createInputSum
        })
        ++this.createInputSum
      }
    },
    components: {
      vodal
    }
  }
</script>

<style scoped="" lang="scss">
  @import "../../../node_modules/vodal/common.css";
  @import "../../../node_modules/vodal/rotate.css";
  @import "../../../static/css/common";
  h3 {
    line-height: 1.6em;
    border-bottom: 1px solid $commonGray;
    margin-bottom: 15px;
  }
  .main {
    position: relative;
    height: 90%;
    border-bottom: 1px solid $commonGray;
    overflow-y: auto;
    overflow-x: hidden;

    .add-btn {
      position: absolute;
      top: 20px;
      left: 47%;
    }

    .icon {
      margin-top: 15%;
    }

    .table-row-sm {
      width: 5%;
    }
    .table-row-medium {
      width: 20%;
    }
    .table-row-lg {
      width: 70%;
    }
  }
  .confirm-btn-group {
    margin-top: 4%;
  }
  .confirm-btn-group button {
    width: 25%;
    max-width: 100px;
  }
</style>
