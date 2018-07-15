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
            title: ''
          }
        }
      },
      extraData: {
        default: null
      }
    },
    methods: {
      hide () {
        this.$emit('hide')
      },
      onConfirmBtnClick (result) {
        this.$emit('onConfirmBtnClick', {
          result: result,
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
    line-height: 2em;
    border-bottom: 1px solid #95A5A6;
    margin-bottom: 15px;
  }
  .confirm-btn-group {
    margin-top: 8%;
  }
  .confirm-btn-group button {
    width: 25%;
    max-width: 100px;
  }
</style>
