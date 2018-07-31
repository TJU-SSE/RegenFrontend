<template>
  <main>
    <div class="edit-container" v-if="isLogin">
      <a title="创建Product" @click="createProductInfo.show = true"><i class="fa fa-plus fa-lg add-btn"></i></a>
    </div>

    <el-input placeholder="请输入内容" v-model="inputSearch" class="input-search">
      <el-button slot="append" icon="el-icon-search" @click="this.handleSearchClick"></el-button>
    </el-input>

    <div v-for="product in products" class="product-item">
      <img :src="product.img_url" :alt="product.title" class="product-img" @click="onItemClick(product.id)">
      <div class="info-container" @click="onItemClick(product.id)">
        <h3 class="title">{{product.title}}</h3>
        <p class="session">{{product.session}}</p>
        <p v-if="getDateStrFromOBj(product.releaseTime)" class="release-time">{{getDateStrFromOBj(product.releaseTime)}}</p>
        <p class="introduction">{{product.introduction.desc}}</p>
      </div>
      <div v-if="isLogin">
        <a class="minus-btn" @click="onDeleteBtnClick(product.id)"><i class="fa fa-trash fa-lg"></i></a>
        <ConfirmVodal :vodalText="confirmVodalText"
                      :show="confirmVodalText.show"
                      @hide="confirmVodalText.show = false"
                      @onConfirmBtnClick="onConfirmDeleteBtnClick"
                      :extraData="confirmVodalText.extraData">
        </ConfirmVodal>
      </div>
    </div>

    <!--<Pagination :pageInfo="pageInfo" @onPageChange="onPageChange"></Pagination>-->
    <el-pagination
      layout="prev, pager, next"
      :page-count="pageInfo.totalPages"
      :page-size="pageInfo.pageSize"
      :current-page="pageInfo.curPageNum"
      @current-change="handleCurPageChange"
    >
    </el-pagination>

    <ProductInput :show="createProductInfo.show"
                  @hide="createProductInfo.show = false"
                  :title="createProductInfo.title"
                  @onConfirmBtnClick="onConfirmBtnClick"></ProductInput>
  </main>
</template>

<script>
  import { mapGetters } from 'vuex'
  import toastr from 'toastr'

  import Pagination from '@/views/components/PaginationV2'
  import ProductInput from '@/views/admin/components/ProductInput'
  import ConfirmVodal from '@/views/components/ConfirmVodal'

  import ProductService from '@/service/ProductService'
  import env from '@/config/env'
  import CommonUtils from '@/config/CommonUtils'
  export default {
    data () {
      return {
        products: [],
        pageInfo: {
          totalPages: 0,
          curPageNum: parseInt(this.$route.params.curPage, 10) || 1,
          pageGroupSum: env.PAGE_GROUP_SUM,
          pageSize: env.PAGE_ITEM_SIZES.PRODUCT
        },
        createProductInfo: {
          show: false,
          title: '创建Product'
        },
        confirmVodalText: {
          title: '删除',
          content: '是否删除这条首页信息？',
          extraData: null,
          show: false
        },
        inputSearch:
          (this.$route.params.inputSearch === '[empty]' || !this.$route.params.inputSearch) ? '' : this.$route.params.inputSearch
      }
    },
    components: {
      Pagination,
      ProductInput,
      ConfirmVodal
    },
    methods: {
      ...mapGetters({
        checkLogin: 'checkLogin'
      }),
      handleCurPageChange (newCurPageNum) {
        this.pageInfo.curPageNum = newCurPageNum
        this.mapDataToUrl()
        this.search(newCurPageNum)

        console.log(this.inputSearch)
      },
      async getItems (newCurPageNum) {
        let respBody = await ProductService.getAll(this, newCurPageNum)
        if (respBody.code === env.RESP_CODE.SUCCESS) {
          this.pageInfo.totalPages = Math.ceil(respBody.msg.total / respBody.msg.itemSize)
          this.products = respBody.msg.products
        } else {
          toastr.error('加载数据失败！')
        }
      },
      onItemClick (productId) {
        this.$router.push({
          name: 'showDisplay',
          params: {
            showId: productId
          }
        })
      },
      async onConfirmBtnClick (result) {
        if (result.result) {
          let respBody = await ProductService.create(this, result.data)
          if (respBody.code === env.RESP_CODE.SUCCESS) {
            this.getItems(this.pageInfo.curPageNum)
            toastr.success('创建成功！')
          } else {
            toastr.error('创建失败！')
          }
          this.createProductInfo.show = false
        }
      },
      onDeleteBtnClick (productId) {
        this.confirmVodalText.extraData = productId
        this.confirmVodalText.show = true
      },
      async onConfirmDeleteBtnClick (result) {
        if (result.result) {
          let respBody = await ProductService.delete(this, {
            id: result.extraData
          })
          if (respBody.code === env.RESP_CODE.SUCCESS) {
            toastr.success('删除成功！')
            this.getItems(this.pageInfo.curPageNum)
          } else {
            toastr.error('删除失败！')
          }
        }
        this.confirmVodalText.show = false
      },
      getDateStrFromOBj (obj) {
        return CommonUtils.getDateStrFromOBj(obj)
      },

      async search (newPageNum) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        if (!this.inputSearch) {
          await this.getItems(newPageNum)
          this.mapDataToUrl()
          window.setTimeout(() => {
            loading.close()
          }, 0)
          return
        }

        const res = await ProductService.search(this, this.inputSearch, newPageNum)

        if (res.code === env.RESP_CODE.SUCCESS) {
          this.pageInfo.totalPages = Math.ceil(res.msg.total / res.msg.itemSize)
          this.products = res.msg.products
        } else {
          toastr.error('加载数据失败！')
        }

        this.mapDataToUrl()
        window.setTimeout(() => {
          loading.close()
        }, 0)
      },

      handleSearchClick () {
        this.search(1)
      },

      mapDataToUrl () {
        this.$router.replace({
          name: 'products',
          params: {
            inputSearch: this.inputSearch || '[empty]',
            curPage: this.pageInfo.curPageNum
          }
        })
      }
    },
    computed: {
      isLogin () {
        return this.checkLogin()
      }
    },
    mounted () {
      this.search(this.pageInfo.curPageNum)
      document.title = env.BRAND_NAME + ' | 案例列表'
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../static/css/news.css";
  @import "../../../static/css/common";
  main {
    padding: 3%;
    position: relative;

    .edit-container {
      position: absolute;
      left: 48%;
      top: 10px;
      z-index: 10;
      font-size: 1.5em;
    }

    .minus-btn {
      margin-left: 20px;
      font-size: 1.5em;
    }
  }

  .product-item {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 3%;

    img.product-img {
      width: 250px;
      cursor: pointer;
    }
    img.product-img:hover {
      opacity: 0.7;
    }

    .info-container {
      margin-left: 3%;
      cursor: pointer;

      .title {
        line-height: 1.5em;
        border-bottom: 1px solid $commonGray;
      }
    }
  }


  .input-search {
    margin-bottom: 24px;
  }


</style>
