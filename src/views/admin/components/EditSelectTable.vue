<template>
  <div class="form-group abs-icon-container">
    <a class="icon" :class=" {'disabled': !canClickAdd}" @click="onSocialAddBtnClick">
      <i class="fa fa-plus fa-lg add-btn"></i>
    </a>
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
        <tr v-for="item,index in inputData">
          <td>
            <select class="form-control" v-model="item.key">
              <option disabled value="">请选择</option>
              <option v-for="selectItem in canSelectItems[index]" :value="selectItem">
                {{selectItem}}
              </option>
            </select>
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
      },
      selectItems: {
        default () {
          return ['facebook', 'weibo', 'instagram', 'weixin']
        }
      }
    },
    data () {
      return {
        nextIndex: 1
      }
    },
    methods: {
      onSocialAddBtnClick () {
        if (!this.canClickAdd) {
          return
        }
        this.inputData.push({
          key: '',
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
      },
      canSelect (selectItem, dataValue) {
        if (selectItem === dataValue) {
          return true
        }
        for (let i = 0; i < this.inputData.length; i++) {
          if (this.inputData[i].key === selectItem) {
            return false
          }
        }
        return true
      }
    },
    computed: {
      canSelectItems () {
        let results = Array(this.inputData.length)
        this.inputData.forEach((curData, index) => {
          results[index] = this.selectItems.filter((selectItem) => {
            return this.canSelect(selectItem, curData.key)
          })
        })
        return results
      },
      canClickAdd () {
        console.log(this.inputData, this.selectItems)
        return this.inputData.length < this.selectItems.length
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
    a.disabled {
      cursor: not-allowed;
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
