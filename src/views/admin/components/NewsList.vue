<template>
  <main>
    <div v-for="newsItem in newsItems" class="news-item">
      <img :src="newsItem.imgUrl" :alt="newsItem.title" class="news-img" @click="onNewsItemClick(newsItem.newsId)">
      <NewsContent :newsItem="newsItem" @onItemClick="onNewsItemClick"></NewsContent>
      <div class="news-edit-panel">
        <p v-if="newsItem.indexData">
          <span><i class="fa fa-line-chart"></i></span>
          <span>rank: {{newsItem.indexData.rank}}</span>
        </p>
        <div v-if="!(newsItem.indexData)">
          <p>
            <button class="btn btn-success" v-if="newsItem.inputRank === null" @click="newsItem.inputRank = 1">
              <i class="fa fa-plus fa-lg"></i> 添加
            </button>
            <button class="btn btn-danger" v-if="newsItem.inputRank !== null" @click="newsItem.inputRank = null">
              <i class="fa fa-close fa-lg"></i> 取消
            </button>
            <button class="btn btn-warning" v-if="newsItem.inputRank !== null" @click="onAddNewsSaveBtnClick(newsItem)">
              <i class="fa fa-save fa-lg"></i> 保存
            </button>
          </p>
          <p class="form-inline" v-if="newsItem.inputRank !== null">
            <span><i class="fa fa-line-chart"></i> rank: </span>
            <input type="number" class="form-control" v-model="newsItem.inputRank">
          </p>
        </div>
      </div>
    </div>

    <Pagination :pageInfo="pageInfo" @onPageChange="onPageChange"></Pagination>
  </main>
</template>

<script>
  import toastr from 'toastr'

  import Pagination from '@/views/components/PaginationV2'
  import NewsContent from '@/views/components/NewsContent'

  import NewsService from '@/service/NewsService'
  import IndexService from '@/service/IndexService'
  import env from '@/config/env'
  export default {
    data () {
      return {
        newsItems: [],
        pageInfo: {
          totalPages: 0,
          curPageNum: 1,
          pageGroupSum: env.PAGE_GROUP_SUM
        }
      }
    },
    props: {
      indexItems: {
        default: function () {
          return []
        }
      }
    },
    components: {
      NewsContent,
      Pagination
    },
    methods: {
      onNewsItemClick (newsId) {
        this.$router.push({
          name: 'newsDetail',
          params: {
            newsId: newsId
          }
        })
      },
      async addItems (newCurPageNum) {
        let respBody = await NewsService.getAll(this, newCurPageNum)
        if (respBody.code === env.RESP_CODE.SUCCESS) {
          this.pageInfo.totalPages = Math.ceil(respBody.msg.total / respBody.msg.itemSize)
          this.pageInfo.curPageNum = newCurPageNum

          respBody.msg.newses.forEach((newsItem) => {
            this.indexItems.forEach((indexItem) => {
              if (newsItem.newsId === indexItem.news_id) {
                newsItem.indexData = indexItem
              }
            })
          })
          respBody.msg.newses.forEach((newsItem, index) => {
            if (!newsItem.indexData) {
              newsItem.indexData = null
            }
            respBody.msg.newses[index] = Object.assign({}, newsItem, {inputRank: null})
          })
          this.newsItems = respBody.msg.newses
        }
      },
      onPageChange (newCurPageNum) {
        this.addItems(newCurPageNum)
      },
      async onAddNewsSaveBtnClick (newsItem) {
        let respBody = await IndexService.create(this, {
          newsId: newsItem.newsId,
          rank: newsItem.inputRank
        })
        if (respBody.code === env.RESP_CODE.SUCCESS) {
          newsItem.indexData = {
            id: respBody.msg.id,
            news_id: newsItem.newsId,
            rank: newsItem.inputRank,
            img_url: newsItem.imgUrl
          }
          this.$emit('onAddNewsSaveBtnClick', newsItem.indexData)
          toastr.success('创建首页Item成功！')
        } else {
          toastr.error('创建首页Item失败！')
        }
      }
    },
    watch: {
      indexItems () {
        this.addItems(this.pageInfo.curPageNum)
      }
    },
    mounted () {
      this.addItems(1)
    }
  }
</script>

<style scoped>
  @import "../../../../static/css/news.css";
  main {
    padding: 3%;
  }

  /* news-item */
  .news-item {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 3%;
  }
  /* #news-item */

  /* news-img */
  .news-item img.news-img{
    width: 250px;
    cursor: pointer;
  }
  img.news-img:hover {
    opacity: 0.7;
  }
  /* #news-img */

  .news-edit-panel {
    position: absolute;
    left: 500px;
  }
</style>
