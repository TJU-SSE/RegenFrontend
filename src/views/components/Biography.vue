<template>
  <div :class="[isSafari ? 'sa-main-container': 'main-container']">
    <div class="biography">
      <h4>BIOGRAPHY</h4>
      <p v-for="value in biography.content">{{value.key}}: {{value.value}}</p>
      <br>
      <div>
        <div v-html="biographyDesc" class="common-markdown">
        </div>
        <!--<a v-if="isLongable && biographyDesc !== null && biographyDesc.length !== 0"-->
        <!--@click="handleExtendBtnClick"-->
        <!--&gt;-->
        <!--{{isExtend ? '合上': '展开'}}-->
        <!--</a>-->
      </div>
      <br>
      <div class="info-table-container">
        <table>
          <thead>
          <tr>
            <th v-for="value in biography.personInfo">{{value.key}}</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <th v-for="value in biography.personInfo">{{value.value}}</th>
          </tr>
          </tbody>
        </table>
        <a class="edit-btn" @click="onPersonInfoEditClick" v-if="isLogin">
          <i class="fa fa-edit fa-lg"></i>
        </a>
      </div>

      <div v-if="biography.products && biography.products !== ''">
        <h4>PORTFOLIO</h4>
        <div v-html="markProducts" class="common-markdown"></div>
        <a
          v-if="isLongable && markProducts !== null && markProducts.length !== 0"
          @click="handleExtendBtnClick"
        >
          {{isExtend ? '合上': '展开'}}
        </a>
      </div>
    </div>

    <div class="extend-item">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="achievement">
          <template slot="title">
            <div class="title">
              ACHIEVEMENT
            </div>
          </template>

          <div class="updates">
            <div class="edit-container" v-if="isLogin">
              <a @click="addVodalInfo.show = true"><i class="fa fa-plus fa-lg add-btn"></i></a>
              <vodal :show="addVodalInfo.show"
                     :width="addVodalInfo.width"
                     :height="addVodalInfo.height"
                     :measure="addVodalInfo.measure"
                     @hide="addVodalInfo.show = false">
                <ProductListEdit :artistId="artistId"
                                 @onAddSaveBtnClick="onAddSaveBtnClickAchievement"
                                 :type="achievementInfo.type"
                                 ref="productListEditAchievement"
                                 :isUpdateProduct="false"
                >
                </ProductListEdit>
              </vodal>
            </div>
            <transition name="slide-fade">
              <div class="pagination" v-if="achievementInfo.upShow && achievementInfo.pageInfo.totalPages">
                <el-pagination
                  layout="prev, pager, next"
                  :page-count="achievementInfo.pageInfo.totalPages"
                  :page-size="achievementInfo.pageInfo.pageSize"
                  :current-page="achievementInfo.pageInfo.curPageNum"
                  @current-change="onAchievmentPageChange"
                >
                </el-pagination>
              </div>
            </transition>
            <transition name="slide-fade">
              <div class="honor-list" v-if="achievementInfo.upShow">
                <presentList ref="datas2"
                             :itemList="achievementInfo.showItems"
                             :artistId="artistId"
                             :type="achievementInfo.type"
                             @onDeleteClick="onDeleteClickAchievement">
                </presentList>
              </div>
            </transition>
            <transition name="slide-fade">
              <div class="pagination" v-if="achievementInfo.upShow && achievementInfo.pageInfo.totalPages">
                <el-pagination
                  layout="prev, pager, next"
                  :page-count="achievementInfo.pageInfo.totalPages"
                  :page-size="achievementInfo.pageInfo.pageSize"
                  :current-page="achievementInfo.pageInfo.curPageNum"
                  @current-change="onAchievmentPageChange"
                >
                </el-pagination>
              </div>
            </transition>
          </div>
        </el-collapse-item>

        <el-collapse-item name="updates">
          <template slot="title">
            <div class="title">
              UPDATES
            </div>
          </template>

          <div class="updates">
            <div class="edit-container" v-if="isLogin">
              <a @click="achievementInfo.addVodalInfo.show = true"><i class="fa fa-plus fa-lg add-btn"></i></a>
              <vodal :show="achievementInfo.addVodalInfo.show"
                     :width="achievementInfo.addVodalInfo.width"
                     :height="achievementInfo.addVodalInfo.height"
                     :measure="achievementInfo.addVodalInfo.measure"
                     @hide="achievementInfo.addVodalInfo.show = false">
                <ProductListEdit
                  :artistId="artistId"
                  @onAddSaveBtnClick="onAddSaveBtnClick"
                  ref="productListEdit"
                  :isUpdateProduct="true"
                >
                </ProductListEdit>
              </vodal>
            </div>
            <transition name="slide-fade">
              <div class="pagination" v-if="upShow && pageInfo.totalPages">
                <el-pagination
                  layout="prev, pager, next"
                  :page-count="pageInfo.totalPages"
                  :page-size="pageInfo.pageSize"
                  :current-page="pageInfo.curPageNum"
                  @current-change="onPageChange"
                >
                </el-pagination>
              </div>
            </transition>
            <transition name="slide-fade">
              <div class="honor-list" v-if="upShow">
                <presentList ref="datas2" :itemList="showItems" :artistId="artistId" @onDeleteClick="onDeleteClick"></presentList>
              </div>
            </transition>
            <transition name="slide-fade">
              <div class="pagination" v-if="upShow && pageInfo.totalPages">
                <el-pagination
                  layout="prev, pager, next"
                  :page-count="pageInfo.totalPages"
                  :page-size="pageInfo.pageSize"
                  :current-page="pageInfo.curPageNum"
                  @current-change="onPageChange"
                >
                </el-pagination>
              </div>
            </transition>
          </div>
        </el-collapse-item>
      </el-collapse>

    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import toastr from 'toastr'
  import Vodal from 'vodal'
  import marked from 'marked'

  import presentList from './PresentList.vue'
  import ProductListEdit from './../admin/components/ProductListEdit.vue'
  import Pagination from '@/views/components/PaginationV2'
  import ConfirmVodal from '@/views/components/ConfirmVodal'

  import env from '@/config/env'
  import ArtistProductService from '@/service/ArtistProductService'

  export default {
    props: {
      biography: {
        default () {
          return {
            content: [],
            desc: '',
            personInfo: {},
            products: ''
          }
        }
      },
      artistId: {
        default: 0
      }
    },
    data () {
      return {
        activeNames: ['updates', 'achievement'],
        pageInfo: {
          totalPages: 0,
          curPageNum: 1,
          pageGroupSum: env.PAGE_GROUP_SUM,
          pageSize: env.PAGE_ITEM_SIZES.PRODUCT_ARTIST
        },
        showItems: [],
        isSafari: false,
        achShow: true,
        upShow: true,
        addVodalInfo: {
          show: false,
          width: 80,
          height: 90,
          measure: '%'
        },
        achievementInfo: {
          upShow: true,
          showItems: [],
          pageInfo: {
            totalPages: 0,
            curPageNum: 1,
            pageGroupSum: env.PAGE_GROUP_SUM,
            pageSize: env.PAGE_ITEM_SIZES.PRODUCT_ARTIST
          },
          type: env.ARTIST_PRODUCT_TYPES.ACHIEVEMENT,
          addVodalInfo: {
            show: false,
            width: 80,
            height: 90,
            measure: '%'
          }
        },
        isExtend: false,
        isLongable: true
      }
    },
    components: {
      Pagination,
      presentList,
      Vodal,
      ProductListEdit,
      ConfirmVodal
    },
    methods: {
      ...mapGetters({
        checkLogin: 'checkLogin'
      }),
      async getItems (newCurPageNum) {
        const respBody = await ArtistProductService.getAll(this, this.artistId, newCurPageNum)
        if (respBody.code === env.RESP_CODE.SUCCESS) {
          this.pageInfo.totalPages = Math.ceil(respBody.msg.total / respBody.msg.itemSize)
          this.showItems = respBody.msg.artistProducts
        } else {
          toastr.error('加载数据失败！')
        }
      },
      async getAchievementItems (newCurPageNum) {
        const respBody = await ArtistProductService.getAll(this, this.artistId, newCurPageNum,
          env.ARTIST_PRODUCT_TYPES.ACHIEVEMENT)

        if (respBody.code === env.RESP_CODE.SUCCESS) {
          this.achievementInfo.pageInfo.totalPages = Math.ceil(respBody.msg.total / respBody.msg.itemSize)
          this.achievementInfo.showItems = respBody.msg.achievements
          console.log('getAchievementItems', respBody.msg)
        } else {
          toastr.error('加载Achievment数据失败！')
        }
      },
      onPageChange (newCurPageNum) {
        this.pageInfo.curPageNum = newCurPageNum
        this.getItems(newCurPageNum)
      },
      onAchievmentPageChange (newCurPageNum) {
        this.achievementInfo.pageInfo.curPageNum = newCurPageNum
        this.getAchievementItems(newCurPageNum)
      },
      onPersonInfoEditClick () {
        this.$emit('onPersonInfoEditClick')
      },
      onAddSaveBtnClick () {
        this.getItems(this.pageInfo.curPageNum)
      },
      onAddSaveBtnClickAchievement () {
        this.getAchievementItems(this.achievementInfo.pageInfo.curPageNum)
      },
      onDeleteClick () {
        this.$refs.productListEdit.update()
        this.getItems(this.pageInfo.curPageNum)
      },
      onDeleteClickAchievement () {
        this.$refs.productListEditAchievement.update()
        this.getAchievementItems(this.achievementInfo.pageInfo.curPageNum)
      },
      handleExtendBtnClick () {
        this.isExtend = !this.isExtend
      }
    },
    computed: {
      isLogin () {
        return this.checkLogin()
      },
      biographyDesc () {
        if (this.biography.desc) {
          let desc = this.biography.desc
//          if (desc !== null && desc.length >= env.BRIEF_LENGTH) {
//            this.isLongable = true
//          } else {
//            this.isLongable = false
//          }
//          if (!this.isExtend) {
//            desc = desc.substr(0, env.BRIEF_LENGTH)
//            if (this.isLongable) {
//              desc += ' ...'
//            }
//          }
          return marked(desc)
        }
        return null
      },
      markProducts () {
        if (this.biography.products) {
          let products = this.biography.products
          this.isLongable = (products !== null) && (products.length >= env.BRIEF_LENGTH)
          if (!this.isExtend) {
            products = products.substr(0, env.BRIEF_LENGTH)
            if (this.isLongable) {
              products += ' ...'
            }
          }
          return marked(products)
        }
        return null
      }
    },
    mounted () {
      let userAgent = navigator.userAgent
      this.isSafari = userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') < 1
      this.getItems(1)
      this.getAchievementItems(1)
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../static/css/common";

  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-active {
    transform: translateX(10px);
    opacity: 0;
  }

  /* main */

  i {
    cursor: pointer;
  }

  .sa-main-container {
    min-height: 2400px;
    width: 100%;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
  }

  .main-container {
    /*height: 100%;*/
    width: 100%;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
  }

  /* 简历 */
  .biography {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    /*width: */
  }

  .biography h4 {
    font-weight: 500;
    font-size: 1.5em;
    margin-bottom: 3px;
  }

  .biography h5 {
    line-height: 1.5em;
    font-size: 1.2em;
  }

  .biography p {
    /*line-height: 1.5em;*/
    margin: 2px 0;
  }

  .biography table {
    font-size: 1.1em;
    margin: 10px auto;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
  }


  .biography thead > tr > th {
    padding: 5px;
    color: #ccc;
  }

  .biography th {
    text-align: center;
  }

  .extend-item {
    margin-top: 24px;
    width: 100%;

    .title {
      font-size: 1.5em;
      font-weight: 500;
    }
  }

  /* achievement && updates */
  .achievement, .updates {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    /*align-items: center;*/
    width: 100%;
    margin-top: 20px;
  }

  .achievement > h4, .updates > h4 {
    align-self: flex-start;
    font-size: 1.5em;
    font-weight: 500;
    margin-bottom: 3px;
  }

  .achievement > hr, .updates > hr {
    width: 100%;
  }

  .sa-achievement-list {
    height: 500px;
  }

  .achievement-list {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    align-items: center;
  }

  /* 标签和时间 */
  .tags {
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    align-self: center;
    margin-left: 30px;
  }

  .tags a {
    margin: 5px;
    padding: 5px;
    text-decoration: none;
    cursor: pointer;
    color: black;
    background-color: #ccc;
    transition: 0.5s;
    border-radius: 5px;
  }

  .tags a:hover {
    opacity: 0.6;
  }

  /* 获奖列表 */
  .honor-list {
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 8px;
    /*margin-bottom: 50px;*/
    /*height: 1800px;*/
  }

  .pagination {
    margin: 0 auto;
  }

  .info-table-container {
    position: relative;

    .edit-btn {
      position: absolute;
      top: 0;
    }
  }

  .updates {
    position: relative;
    .edit-container {
      position: absolute;
      top: -62px;
      left: 45%;
      font-size: 1.5em;
    }
    .product-title {
      align-items: stretch;
      cursor: pointer;
    }
    hr {
      margin: 5px 0;
      color: $commonGray;
    }
  }

</style>
