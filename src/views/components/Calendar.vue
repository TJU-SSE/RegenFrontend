<template>
  <div class="form-group">
    <div class="col-sm-3">
      <select class="form-control" v-model="year">
        <option value="0">不显示年</option>
        <option v-for="curYear in years" :value="curYear">{{curYear}}年</option>
      </select>
    </div>
    <div class="col-sm-3">
      <select class="form-control" v-model="month">
        <option value="0">不显示月</option>
        <option v-for="curMonth in months" :value="curMonth">{{curMonth}}月</option>
      </select>
    </div>
    <div class="col-sm-3">
      <select class="form-control" v-model="day">
        <option value="0">不显示日</option>
        <option v-if="month != 0" v-for="curDay in days" :value="curDay">{{curDay}}日</option>
      </select>
    </div>
  </div>
</template>

<script>
  import CommonUtils from '../../config/CommonUtils'
  export default {
    props: {
      year: {
        default: CommonUtils.getCurYear()
      },
      month: {
        default: 0
      },
      day: {
        default: 0
      }
    },
    data () {
      return {
        years: CommonUtils.range(1970, 2100),
        months: CommonUtils.range(1, 13),
        days: CommonUtils.range(1, 32)
      }
    },
    methods: {
      updateDays () {
        if (this.month === 0) {
          return
        }
        let daysLen = CommonUtils.getDaysWithMonthAndYear(this.year, this.month)
        let oldLen = this.days.length
        if (oldLen < daysLen) {
          for (let i = oldLen + 1; i <= daysLen; i++) {
            this.days.push(i)
          }
        } else if (oldLen > daysLen) {
          for (let i = oldLen - daysLen; i > 0; i--) {
            this.days.pop()
          }
        }
      },
      valueChange () {
        this.$emit('change', {
          year: this.year,
          month: parseInt(this.month),
          day: parseInt(this.day)
        })
      }
    },
    watch: {
      month () {
        this.updateDays()
        this.valueChange()
      },
      year () {
        this.updateDays()
        this.valueChange()
      },
      day () {
        this.valueChange()
      }
    }
  }
</script>
