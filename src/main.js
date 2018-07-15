import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import AwesomeSwiper from 'vue-awesome-swiper'

import CommonUtils from './config/CommonUtils'

import 'element-ui/lib/theme-chalk/index.css'
require('../node_modules/bootstrap/dist/css/bootstrap.min.css')
require('../node_modules/jquery/dist/jquery.min')
require('../node_modules/font-awesome/css/font-awesome.min.css')
import '../static/css/common.scss'

Vue.config.productionTip = false

Vue.use(VueResource)
Vue.use(ElementUI)
Vue.use(AwesomeSwiper)

router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.role) {
    let role = store.getters.getUserRole
    let requireRoles = to.meta.role
    if (role === null) {
      next('/login')
    } else if (CommonUtils.checkItemInArray(role, requireRoles)) {
      next()
    } else {
      next('/login')
    }
  }
  next()
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
