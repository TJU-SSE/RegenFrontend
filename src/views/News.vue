<template>
  <main>
    <p class="news-page-title">LATEST</p>
    <div v-for="newsItem in newsItems" class="news-item">
      <img :src="newsItem.imgUrl" :alt="newsItem.title" class="news-img" @click="onNewsItemClick(newsItem.newsId)">
      <NewsContent :newsItem="newsItem" @onItemClick="onNewsItemClick"></NewsContent>
      <div v-if="isLogin">
        <a class="minus-btn" @click="onDeleteBtnClick(newsItem.newsId)"><i class="fa fa-trash fa-lg"></i></a>
        <ConfirmVodal :show="deleteVodalInfo.show"
                      :vodalText="deleteVodalInfo.text"
                      :extraData="deleteVodalInfo.extraData"
                      @onConfirmBtnClick="onDeleteConfirmBtnClick"
                      @hide="deleteVodalInfo.show = false"></ConfirmVodal>
      </div>
    </div>

    <Pagination :pageInfo="pageInfo" @onPageChange="onPageChange"></Pagination>
  </main>
</template>

<script>
  import Pagination from './components/PaginationV2.vue'
  import ConfirmVodal from './components/ConfirmVodal'
  import NewsContent from './components/NewsContent'
  import NewsService from '@/service/NewsService'
  import env from '@/config/env'
  import toastr from 'toastr'
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        title: env.BRAND_NAME + ' | NEWS',
        newsItems: [],
        pageInfo: {
          totalPages: 0,
          curPageNum: 1,
          pageGroupSum: env.PAGE_GROUP_SUM
        },
        deleteVodalInfo: {
          show: false,
          text: {
            content: '确定要删除这条新闻吗？',
            title: '确定要删除这条新闻吗?'
          },
          extraData: null
        }
      }
    },
    components: {
      NewsContent,
      Pagination,
      ConfirmVodal
    },
    methods: {
      ...mapGetters({
        checkLogin: 'checkLogin'
      }),
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
          this.newsItems = respBody.msg.newses
          this.pageInfo.totalPages = Math.ceil(respBody.msg.total / respBody.msg.itemSize)
          this.pageInfo.curPageNum = newCurPageNum
        }
      },
      onPageChange (newCurPageNum) {
        this.addItems(newCurPageNum)
      },
      onDeleteBtnClick (newsId) {
        this.deleteVodalInfo.extraData = newsId
        this.deleteVodalInfo.show = true
      },
      async onDeleteConfirmBtnClick (result) {
        if (result.result) {
          let resp = await NewsService.delete(this, {
            id: result.extraData
          })
          if (resp.code === env.RESP_CODE.SUCCESS) {
            this.addItems(this.pageInfo.curPageNum)
            toastr.success('删除成功！')
          } else {
            toastr.error('删除失败！')
          }
        }
        this.deleteVodalInfo.show = false
      }
    },
    mounted () {
      document.title = this.title
      this.addItems(1)
    },
    computed: {
      isLogin () {
        return this.checkLogin()
      }
    }
  }
</script>

<style scoped>
  @import "../../static/css/news.css";
  main {
    padding: 3%;
  }

  /* news-item */
  .news-item {
    display: flex;
    align-items: center;
    margin-bottom: 2%;
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

  @media screen and (max-width: 780px) {
    .news-item {
      flex-direction: column;
      margin-bottom: 6%;
    }
  }

</style>
