<template>
  <header class="header-wrap">

    <header class="header regen-container">

      <div class="sm-brand-container">
        <img src="../../../static/img/logo-sm.jpg" alt="small brand">
      </div>

      <div class="header-main">
        <ul class="header-list header-menu">
          <li @click="handleHeadChange('home')" :class="curPathName==='home'?'active':''">
            <span>HOME</span>
          </li>
          <li :class="curPathName==='fashionShow'?'active':''"
              @mouseenter="onFashionShowMouseOver"
              @mouseleave="onFashionShowMouseOut"
              @click="onFashionShowMouseOver"
              target-data="fashionShowTarget"
              id="fashionShowLi">
            <span>FASHION SHOW</span>
          </li>
          <li :class="curPathName==='photography'?'active':''"
              @mouseenter="onPhotographyMouseOver"
              @mouseleave="onPhotographyMouseOut"
              @click="onPhotographyMouseOver"
              target-data="photographyTarget"
              id="photographyLi">
            <span>PHOTOGRAPHY</span>
          </li>
          <li v-for="headItem in headItems"
              v-if="!headItem.authority || (headItem.authority && isLogin)"
              @click="handleHeadChange(headItem.name)"
              :key="headItem.name"
              :class="curPathName===headItem.name?'active':''">
            <span>{{headItem.title}}</span>
          </li>

          <li class="add-btn" v-if="hasAddBtn" @click="onAddBtnClick">
            <a><i class="fa fa-plus fa-lg"></i></a>
          </li>
        </ul>

        <ul class="header-list header-list-right header-menu">
          <li class="header-search" @click="handleCustomerSearchClick" v-if="curPathName === 'home'">
            <span>CUSTOMIZED SEARCH </span>
          </li>
          <li class="header-search">
            <el-popover
              ref="popoverSearch"
              width="350"
              placement="bottom"
              title=""
              trigger="click"
              :popper-class="'search-panel-popper'"
            >
              <SearchPanel></SearchPanel>
            </el-popover>
            <div>
              <i class="fa fa-search" v-popover:popoverSearch></i>
            </div>

          </li>
          <li class="left-margin-item" v-if="isLogin" @click="onLogoutBtnClick">
            {{username}}
            <i class="fa fa-sign-out"></i>
            logout
          </li>
        </ul>
      </div>

      <div @click="handleHeadChange('home')" class="brand-container">
        <img src="../../../static/img/logo2.jpg" class="brand">
        <!--<a class="link">EN/CN</a>-->
      </div>
    </header>

    <div class="second-header-wrap">

      <transition name="slide">
        <header class="regen-container second-header"
                :class="curPathName==='fashionShow'?'active':''"
                v-if="curPathName==='fashionShow'||isShowingFashionShow"
                @mouseenter="onFashionShowMouseOver"
                @mouseleave="onFashionShowMouseOut"
                target-data="fashionShowLi"
        >
          <ul class="header-list second-header-menu" id="fashionShowTarget">
            <li
              target-data="fashionShowLi"
              @click="handleSecondHeadChange('fashionShow', 'showDirector')"
              :class="curSecondMenuName==='showDirector'?'active':''"
            >
              <span target-data="fashionShowLi">SHOW DIRECTOR</span>
            </li>
            <li
              target-data="fashionShowLi"
              @click="handleSecondHeadChange('fashionShow', 'styling')"
              :class="curSecondMenuName==='styling'?'active':''">
              <span target-data="fashionShowLi">STYLING</span>
            </li>
            <li
              target-data="fashionShowLi"
              @click="handleSecondHeadChange('fashionShow', 'fashionShowCasting')"
              :class="curSecondMenuName==='casting'?'active':''">
              <span target-data="fashionShowLi">CASTING</span>
            </li>
          </ul>
        </header>
      </transition>

      <transition name="slide">
        <header class="second-header regen-container"
                :class="curPathName==='photography'?'active':''"
                @mouseenter="onPhotographyMouseOver"
                @mouseleave="onPhotographyMouseOut"
                target-data="photographyLi"
                v-if="curPathName==='photography'||isShowingPhotography"
        >
          <ul class="header-list second-header-menu" id="photographyTarget">
            <li
              target-data="photographyLi"
              @click="handleSecondHeadChange('photography', 'photographer')"
              :class="curSecondMenuName==='photographer'?'active':''">
              <span>PHOTOGRAPHER</span>
            </li>
            <li
              target-data="photographyLi"
              @click="handleSecondHeadChange('photography', 'artDirector')"
              :class="curSecondMenuName==='artDirector'?'active':''">
              <span target-data="photographyLi">ART DIRECTOR</span>

            </li>
            <li
              target-data="photographyLi"
              @click="handleSecondHeadChange('photography', 'styling')"
              :class="curSecondMenuName==='styling'?'active':''">
              <span target-data="photographyLi">STYLING</span>
            </li>
            <li
              target-data="photographyLi"
              @click="handleSecondHeadChange('photography', 'photographyCasting')"
              :class="curSecondMenuName==='casting'?'active':''">
              <span target-data="photographyLi">CASTING</span>
            </li>
            <li
              target-data="photographyLi"
              @click="handleSecondHeadChange('photography', 'fashionFilm')"
              :class="curSecondMenuName==='fashionFilm'?'active':''">
              <span target-data="photographyLi">FASHION FILM</span>
            </li>
          </ul>
        </header>
      </transition>
    </div>

    <div class="customer-search-container"  v-if="curPathName === 'home'">
      <el-collapse v-model="customerSearchActives">
        <el-collapse-item title="" name="customerSearch">
          <TagsSelect></TagsSelect>
        </el-collapse-item>
      </el-collapse>
    </div>

  </header>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import * as MutationTypes from '../../store/mutationTypes'

  import CommonUtils from '../../config/CommonUtils'
  import TagsSelect from '../components/TagsSelect.vue'
  import SearchPanel from '../components/SearchPanel.vue'

  export default {
    data () {
      return {
        isShowingFashionShow: false,
        isShowingPhotography: false,
        title: 'home',
        headItems: [
          {
            name: 'talent',
            title: 'TALENT'
          },
          {
            name: 'news',
            title: 'NEWS'
          },
          {
            name: 'contact',
            title: 'CONTACT'
          },
          {
            name: 'products',
            title: '作品库',
            authority: true
          },
          {
            name: 'tags',
            title: '标签库',
            authority: true
          }
        ],
        customerSearchActives: []
      }
    },
    components: {
      TagsSelect,
      SearchPanel
    },
    methods: {
      ...mapMutations({
        logout: MutationTypes.LOGOUT
      }),
      ...mapGetters({
        getUsername: 'getUsername',
        checkLogin: 'checkLogin'
      }),
      handleCustomerSearchClick () {
        if (this.customerSearchActives.length) {
          this.customerSearchActives = []
        } else {
          this.customerSearchActives = ['customerSearch']
        }
      },
      onFashionShowMouseOver: function () {
        if (!this.isShowingFashionShow) {
          this.isShowingFashionShow = true
        }
        this.isShowingPhotography = false
      },
      onFashionShowMouseOut: function (event) {
        let fromData = event.target.getAttribute('target-data')
        let toData = event.relatedTarget.getAttribute('id')
        let fromData2 = event.relatedTarget.getAttribute('target-data')
        let toData2 = event.target.getAttribute('id')
        if ((fromData !== toData && fromData2 !== toData2) || fromData === null || fromData2 === null) {
          this.isShowingFashionShow = false
        }
      },
      onPhotographyMouseOver: function () {
        if (!this.isShowingPhotography) {
          this.isShowingPhotography = true
        }
        this.isShowingFashionShow = false
      },
      onPhotographyMouseOut: function (event) {
        let fromData = event.target.getAttribute('target-data')
        let toData = event.relatedTarget.getAttribute('id')

        let fromData2 = event.relatedTarget.getAttribute('target-data')
        let toData2 = event.target.getAttribute('id')
        if ((fromData !== toData && fromData2 !== toData2) || fromData === null || fromData2 === null) {
          this.isShowingPhotography = false
        }
      },
      onLogoutBtnClick () {
        this.logout()
        if (this.$route.meta && this.$route.meta.role) {
          this.$router.push({
            name: 'home'
          })
        }
      },
      onAddBtnClick () {
        switch (this.curPathName) {
          case 'news':
            console.log('in!', this.curPathName)
            this.$router.push({
              name: 'createNews'
            })
            break
          default:
            break
        }
      },
      handleHeadChange (headItemName) {
        this.isShowingPhotography = false
        this.isShowingFashionShow = false
        if (headItemName === 'talent') {
          this.$router.push({
            name: 'talent',
            params: {
              secondMenu: 'talent'
            }
          })
        } else if (headItemName === 'products') {
          this.$router.push({
            name: headItemName,
            params: {
              inputSearch: '[empty]',
              curPage: 1
            }
          })
        } else {
          this.$router.push({
            name: headItemName
          })
        }
      },
      handleSecondHeadChange (headItemName, secondName) {
        this.isShowingPhotography = false
        this.isShowingFashionShow = false
        this.$router.push({
          name: headItemName,
          params: {
            secondMenu: secondName
          }
        })
      }
    },
    computed: {
      curPathName: function () {
        return this.$route.name
      },
      curSecondMenuName: function () {
        return this.$route.params.secondMenu
      },
      isLogin () {
        return this.checkLogin()
      },
      username () {
        return this.getUsername()
      },
      hasAddBtn () {
        if (!this.isLogin) {
          return false
        }
        return !!CommonUtils.checkItemInArray(this.curPathName, ['news'])
      }
    },
    mounted () {
      document.title = this.title
    }
  }
</script>

<style lang="scss">
  .header-wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #222222;

    * {
      font-family: Seravek;
    }
    .sm-brand-container {
      display: none;
      position: relative;
      margin-right: 5px;
      width: 35px;

      img {
        position: absolute;
        top: -12px;
        width: 35px;
      }
    }

    /* first head */
    .header {
      display: flex;
      justify-content: space-between;
      padding-top: 45px;
      /*overflow: hidden;*/
      position: relative;
    }

    .header-main {
      display: flex;
      justify-content: space-between;
      flex: 1;
    }

    .header a {
      text-decoration: none;
    }

    .header, .header li,  .header li span, .second-header, .second-header li {
      font-size: 14px;
      font-weight: normal;
    }

    .header li {
      padding-bottom: 25px;
    }

    .header .header-list, .header .header-search, .header .header-list li a {
      color: #222222;
    }
    .second-header .header-list, .second-header .header-search, .second-header .header-list li a{
      color: white;
    }

    .header-list {
      flex: 1;
      list-style: none;
      margin: 0;
    }

    .header-list-right {
      flex: .4;
      list-style: none;
    }

    .header-menu {
      display: flex;
      align-items: flex-end;
      flex-wrap: wrap;
      position: relative;
    }

    .header-list li {
      position: relative;
      margin: 0 3% 0 0;
      cursor: pointer;
    }

    .header-list li.active span{
      border-bottom: 1px solid #222222;
    }

    .header-list li:hover a, .header .header-search:hover, .header-list li:hover{
      color: #d2d7d3;
    }

    .header .brand {
      position: absolute;
      top: -6px;
      right: 30px;
      height: 100px;
    }
    .header .brand-container {
      text-align: right;
    }
    .header .brand-container .link {
      display: block;
      cursor: pointer;
      font-size: small;
    }
    .header .brand-container .link:hover {
      font-weight: bold;
    }

    .header .left-margin-item {
      margin-left: 6%;
    }
    /* #first head */

    .customer-search-container {
      .el-collapse {
        border: none;
        .el-collapse-item{
          border: none;
          &.is-active {
            border-top: 1px solid black;
            border-bottom: 1px solid black;
          }
        }
        .el-collapse-item__header {
          display: none;
        }
        .el-collapse-item__content {
          padding: 12px 0;
        }
      }
    }

    /* second head */
    .second-header-wrap {
      position: relative;
      z-index: 10;
    }
    .second-header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 50px;
      background: #222222;
      z-index: 10;
    }
    .second-header.active{
      position: static;
      /*margin-bottom: 3%;*/
    }
    .second-header-menu {
      height: 100%;
      display: flex;
      align-items: center;
    }
    .second-header-menu li {
      height: 90%;
      display: flex;
      align-items: center;
    }
    .second-header li.active span{
      border-bottom: 1px solid white;
    }
    /* #second head */


    /* slide */
    .slide-enter-active, .message-item-container {
      -webkit-transition: all .08s linear;
      -o-transition:      all .08s linear ;
      transition:         all .08s linear;
    }
    .slide-enter {
      transform:          translateY(-20px);
      -webkit-transform:  translateY(-20px);
      -o-transform:       translateY(-20px);
    }
    /* #slide */

    /* add-btn */
    .header-list .add-btn {
      margin-left: 18%;
    }
    /* #add-btn */
    @media screen and (max-width: 780px) {
      .header, .header li,  .header li span, .second-header, .second-header li {
        font-size: 12px;
        margin: 0 5px 0 0;
      }
      .second-header li {
        margin: 5px;
      }

      .sm-brand-container {
        display: block;
      }

      .header {
        padding-top: 30px;

        li {
          padding-bottom: 15px;
        }
      }

      .header-main {
        overflow: auto;

        .header-menu {
          display: block;
          min-width: 400px;

          li {
            display: inline-block;
          }
          &.header-list-right {
            min-width: 150px;
            .header-search {
              line-height: 0;
            }
          }
        }
      }
      .second-header {
        width: 100%;
        overflow: auto;
        .second-header-menu {
          min-width: 400px;
        }
      }

      .brand-container {
        display: none!important;
      }
    }
  }

</style>
