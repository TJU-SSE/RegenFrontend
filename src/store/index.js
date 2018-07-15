import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import * as mutations from './mutations'
import user from './modules/user'

Vue.use(Vuex)

const state = {
}

const store = new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  modules: {
    user
  }
})

export default store
