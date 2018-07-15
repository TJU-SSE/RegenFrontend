<template>
  <main>
    <el-input placeholder="请输入内容" v-model="inputSearch" class="input-search">
      <el-button slot="append" icon="el-icon-search" @click="this.handleSearchClick"></el-button>
    </el-input>

    <div v-for="product in products" class="product-item">
      <img :src="product.img_url" :alt="product.title" class="product-img">
      <div class="info-container">
        <h3 class="title">{{product.title}}</h3>
        <p class="session">{{product.session}}</p>
        <p class="release-time">{{getDateStrFromObj(product.releaseTime)}}</p>
        <p class="introduction">{{product.introduction.desc}}</p>
      </div>
      <div v-if="product.rank!==-1 || (product.index && product.index.id !== -1)">
        <p class="rank"><i class="fa fa-line-chart"></i> Rank: {{product.index ? (product.index.rank) : product.rank}}</p>
      </div>
      <div v-if="product.rank===-1 && (!product.index || product.index.id === -1)" class="add-product-container">
        <p>
          <button class="btn btn-success" v-if="product.inputRank === null" @click="product.inputRank = 1">
            <i class="fa fa-plus fa-lg"></i> 添加
          </button>
          <button class="btn btn-danger" v-if="product.inputRank !== null" @click="product.inputRank = null">
            <i class="fa fa-close fa-lg"></i> 取消
          </button>
          <button class="btn btn-warning" v-if="product.inputRank !== null" @click="onAddSaveBtnClick(product)">
            <i class="fa fa-save fa-lg"></i> 保存
          </button>
        </p>
        <p class="form-inline" v-if="product.inputRank !== null">
          <span><i class="fa fa-line-chart"></i> rank: </span>
          <input type="number" class="form-control" v-model="product.inputRank">
        </p>
      </div>
    </div>

    <el-pagination
      layout="prev, pager, next"
      :page-count="pageInfo.totalPages"
      :page-size="pageInfo.pageSize"
      @current-change="handleCurPageChange"
    >
    </el-pagination>

  </main>
</template>

<script>
  import { mapGetters } from 'vuex'
  import toastr from 'toastr'

  import Pagination from '@/views/components/PaginationV2'
  import ConfirmVodal from '@/views/components/ConfirmVodal'

  import ArtistProductService from '@/service/ArtistProductService'
  import ProductService from '@/service/ProductService'
  import IndexProductService from '@/service/IndexProductService'
  import env from '@/config/env'
  import CommonUtils from '@/config/CommonUtils'
  export default {
    props: {
      artistId: {
        default: 0
      },
      type: {
        default: env.ARTIST_PRODUCT_TYPES.UPDATES
      },
      isIndexProduct: {
        default: false
      },
      isUpdateProduct: {
        default: false
      }
    },
    data () {
      return {
        products: [],
        pageInfo: {
          totalPages: 0,
          curPageNum: 1,
          pageGroupSum: env.PAGE_GROUP_SUM
        },
        confirmVodalText: {
          title: '删除',
          content: '是否删除这条首页信息？',
          extraData: null,
          show: false
        },
        inputSearch: ''
      }
    },
    components: {
      Pagination,
      ConfirmVodal
    },
    methods: {
      ...mapGetters({
        checkLogin: 'checkLogin'
      }),
      handleCurPageChange (newCurPageNum) {
        this.search(newCurPageNum)
      },
      update () {
        this.getItems(this.pageInfo.curPageNum)
      },
      async getItems (newCurPageNum) {
        let res
        if (this.isIndexProduct) {
          res = await ProductService.getAll(this, newCurPageNum)
        } else {
          res = await ProductService.getAllWithRank(this, this.artistId, newCurPageNum, this.type)
        }

        if (res.code === env.RESP_CODE.SUCCESS) {
          this.pageInfo.totalPages = Math.ceil(res.msg.total / res.msg.itemSize)
          this.products = res.msg.products
        } else {
          toastr.error('加载数据失败！')
        }
      },
      onPageChange (newCurPageNum) {
        this.getItems(newCurPageNum)
      },
      async onAddSaveBtnClick (product) {
        if (this.isIndexProduct) {
          const res = await IndexProductService.create(this, {
            productId: product.id,
            rank: product.inputRank
          })
          if (res.code === env.RESP_CODE.SUCCESS) {
            product.index.rank = product.inputRank
            product.index.id = 0
            product.inputRank = null
            toastr.success('添加成功！')
            this.$emit('onAddSaveBtnClick')
          } else {
            toastr.error('添加失败！')
          }
          return
        }
        let respBody = await ArtistProductService.create(this, {
          artistId: this.artistId,
          productId: product.id,
          rank: product.inputRank
        }, this.type)
        if (respBody.code === env.RESP_CODE.SUCCESS) {
          product.rank = product.inputRank
          product.inputRank = null
          toastr.success('添加成功！')
          this.$emit('onAddSaveBtnClick')
        } else {
          toastr.error('添加失败！')
        }
      },
      getDateStrFromObj (obj) {
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
          window.setTimeout(() => {
            loading.close()
          }, 0)
          return
        }

        let res
        if (this.isIndexProduct) {
          res = await ProductService.search(this, this.inputSearch, newPageNum)
        } else {
          if (this.isUpdateProduct) {
            res = await ProductService.searchWithRank(this, this.artistId, 0, this.inputSearch, newPageNum)
          } else {
            res = await ProductService.searchWithRank(this, this.artistId, 1, this.inputSearch, newPageNum)
          }
        }

        if (res.code === env.RESP_CODE.SUCCESS) {
          this.pageInfo.totalPages = Math.ceil(res.msg.total / res.msg.itemSize)
          this.products = res.msg.products
        } else {
          toastr.error('加载数据失败！')
        }

        window.setTimeout(() => {
          loading.close()
        }, 0)
      },

      handleSearchClick () {
        this.search(1)
      }
    },
    computed: {
      isLogin () {
        return this.checkLogin()
      }
    },
    mounted () {
      this.getItems(1)
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../../static/css/news.css";
  @import "../../../../static/css/common";
  main {
    margin: 3%;
    padding: 3%;
    position: relative;

    .edit-container {
      position: absolute;
      left: 48%;
      top: 10px;
      z-index: 10;
      font-size: 1.2em;
    }

    .rank {
      margin-left: 30px;
    }
    .minus-btn {
      margin-left: 30px;
      font-size: 1em;
    }
    .add-btn {
      margin-left: 30px;
      font-size: 1em;
    }
    .add-product-container {
      margin-left: 30px;
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
