<template>
  <vodal :show="show"
         @hide="hide"
         animation="rotate"
         :height="vodalInfo.height"
         :width="vodalInfo.width"
         :measure="vodalInfo.measure">
    <div>
      <h3>{{vodalText.title}}</h3>
      <p>{{vodalText.content}}</p>
      <p>
        <input v-if="inputType==='number'" type="number" class="form-control" :placeholder="vodalText.placeholder" v-model="vodalText.inputText">
        <input v-if="inputType==='text'" type="text" class="form-control" :placeholder="vodalText.placeholder" v-model="vodalText.inputText">
      </p>
      <div class="confirm-btn-group">
        <button class="btn btn-success" @click="onConfirmBtnClick(true)">确定</button>
        <button class="btn btn-danger" @click="onConfirmBtnClick(false)">取消</button>
      </div>
    </div>
  </vodal>
</template>

<script>
  import vodal from 'vodal'
  export default {
    props: {
      show: {
        default: false
      },
      vodalInfo: {
        default () {
          return {
            height: 30,
            width: 50,
            measure: '%'
          }
        }
      },
      vodalText: {
        default () {
          return {
            content: '',
            title: '',
            placeholder: '',
            inputText: null
          }
        }
      },
      extraData: {
        default: null
      },
      inputType: {
        default: 'number'
      }
    },
    methods: {
      hide () {
        this.$emit('hide')
      },
      onConfirmBtnClick (result) {
        this.$emit('onConfirmBtnClick', {
          result: result,
          inputText: this.vodalText.inputText,
          extraData: this.extraData
        })
      }
    },
    components: {
      vodal
    }
  }
</script>

<style scoped="">
  @import "../../../node_modules/vodal/common.css";
  @import "../../../node_modules/vodal/rotate.css";
  h3 {
    line-height: 1.6em;
    border-bottom: 1px solid #95A5A6;
    margin-bottom: 15px;
  }
  .confirm-btn-group {
    margin-top: 4%;
  }
  .confirm-btn-group button {
    width: 25%;
    max-width: 100px;
  }
</style>
