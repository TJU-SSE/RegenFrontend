import * as types from '../mutationTypes'

const state = {
  username: localStorage.username || '',
  selectedTags: []
}

const getters = {
  getUsername: state => state.username,
  getUserRole: state => state.username ? 'admin' : null,
  checkLogin: state => state.username !== '',
  getSelectedTags: state => state.selectedTags
}

const actions = {
}

const mutations = {
  [types.UPDATE_USERNAME] (state, username) {
    state.username = username
    localStorage.username = username
  },

  [types.LOGOUT] (state) {
    state.username = ''
    localStorage.username = ''
  },

  [types.UPDATE_SELECTED_TAGS] (state, selectedTags) {
    state.selectedTags = selectedTags
    console.log('what', state.selectedTags)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
