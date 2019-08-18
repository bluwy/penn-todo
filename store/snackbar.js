export const state = () => ({
  snack: {}
})

export const mutations = {
  SET_TOAST (state, { text, type }) {
    state.snack = { text, type }
  }
}

export const actions = {
  sendSnack ({ commit }, { text, type = 'default' }) {
    commit('SET_TOAST', { text, type })
  }
}
