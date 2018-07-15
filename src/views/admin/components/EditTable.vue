<template>
  <div class="form-group abs-icon-container">
    <a class="icon" @click="onSocialAddBtnClick"><i class="fa fa-plus fa-lg add-btn"></i></a>
    <label class="col-sm-2 control-label">
      {{title}}
    </label>

    <div class="col-sm-8">
      <table class="table table-striped table-bordered table-hover">
        <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
          <th>Option</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in inputData">
          <td>
            <input type="text" class="form-control" placeholder="Input Key" v-model="item.key">
          </td>
          <td>
            <input type="text" class="form-control" placeholder="Input Value" v-model="item.value">
          </td>
          <td class="center-cell">
            <a @click="onSocialDeleteBtnClick(item)"><i class="fa fa-close fa-lg minus-btn"></i></a>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      inputData: {
        default () {
          return []
        }
      },
      title: {
        default: 'Title'
      }
    },
    data () {
      return {
        nextIndex: 1
      }
    },
    methods: {
      onSocialAddBtnClick () {
        this.inputData.push({
          key: 'key' + this.nextIndex,
          value: 'value' + this.nextIndex
        })
        this.nextIndex ++
      },
      onSocialDeleteBtnClick (deleteItem) {
        for (let index = 0; index < this.inputData.length; index++) {
          if (this.inputData[index] === deleteItem) {
            this.inputData.splice(index, 1)
            break
          }
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../../static/css/common";
  .abs-icon-container {
    position: relative;
    .icon {
      position: absolute;
      top: 8px;
      right: 12%;
      z-index: 8;
    }
    .center-cell {
      text-align: center;
      a {
        display: block;
        margin-top: 10%;
      }
    }
  }
</style>
