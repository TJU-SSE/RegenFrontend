import * as types from './mutationTypes'

export const updateUsername = ({ commit }, username) => {
  commit(types.UPDATE_USERNAME, username)
}

export const setSelectedTags = ({ commit }, selectedTags) => {
  commit(types.UPDATE_SELECTED_TAGS, selectedTags)
}
