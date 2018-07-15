<template>
  <nav aria-label="Page navigation">
    <ul class="pagination" v-if="pageInfo.totalPages>1">
      <li @click="onPageChange($event,pageInfo.curPageNum-1)"
          :class="{'disabled':pageInfo.curPageNum===1}">
        <a aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li v-for="pageNum in pageList"
          :class="{'active':pageNum===pageInfo.curPageNum}"
          @click="onPageChange($event,pageNum)">
        <a>{{pageNum}}</a>
      </li>
      <li @click="onPageChange($event,pageInfo.curPageNum+1)"
          :class="{'disabled':pageInfo.curPageNum===pageInfo.totalPages}">
        <a aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
  export default {
    props: {
      pageInfo: {
        default: function () {
          return {
            totalPages: 0, // 总的页数
            curPageNum: 0, // 当前页数
            pageGroupSum: 0 // 展示的标签数
          }
        }
      }
    },
    computed: {
      pageList () {
        let startPage = 0
        let endPage = 0
        let halfPageGroup = ~~(this.pageInfo.pageGroupSum / 2)
        if (this.pageInfo.curPageNum <= halfPageGroup) {
          startPage = 1
          endPage = Math.min(this.pageInfo.pageGroupSum, this.pageInfo.totalPages)
        } else if (this.pageInfo.curPageNum >= (this.pageInfo.totalPages - halfPageGroup)) {
          endPage = this.pageInfo.totalPages
          startPage = Math.max(1, this.pageInfo.totalPages - this.pageInfo.pageGroupSum + 1)
        } else {
          startPage = this.pageInfo.curPageNum - halfPageGroup
          endPage = this.pageInfo.curPageNum + halfPageGroup
        }
        let result = []
        for (let i = startPage; i <= endPage; i++) {
          result.push(i)
        }
        console.log(startPage, endPage, this.pageInfo)
        return result
      }
    },
    methods: {
      onPageChange (event, newValue) {
        if (newValue >= 1 && newValue <= this.pageInfo.totalPages) {
          this.pageInfo.curPageNum = newValue
          this.$emit('onPageChange', this.pageInfo.curPageNum)
        }
      }
    }
  }
</script>

<style scoped="">
  .pagination li a {
    cursor: pointer;
  }
</style>
