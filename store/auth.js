const JWT_TOKEN = 'jwtToken'

export const state = () => ({
  token: '',
  userData: null
})

export const mutations = {
  SET_TOKEN (state, { token }) {
    token = token || ''
    state.token = token
    if (token) {
      this.$axios.setToken(token)
      localStorage.setItem(JWT_TOKEN, token)
    } else {
      this.$axios.setToken(false)
      localStorage.removeItem(JWT_TOKEN)
    }
  },
  SET_USER_DATA (state, { data }) {
    state.userData = data
  }
}

export const actions = {
  async nuxtClientInit ({ dispatch }) {
    await dispatch('check').catch(() => {})
  },
  check ({ commit }) {
    const token = localStorage.getItem(JWT_TOKEN) || ''
    if (token) {
      return this.$axios.$post('/auth/check', { token })
        .then((data) => {
          commit('SET_TOKEN', { token })
          commit('SET_USER_DATA', { data })
          return data
        })
        .catch((e) => {
          commit('SET_TOKEN', { token: '' })
          commit('SET_USER_DATA', { data: null })
          return Promise.reject(e)
        })
    } else {
      commit('SET_TOKEN', { token: '' })
      commit('SET_USER_DATA', { data: null })
      return Promise.reject(new Error('No token'))
    }
  },
  signup ({ getters }, { name, email, password }) {
    if (getters.isAuthed) { return }

    return this.$axios.$post('/auth/signup', { name, email, password })
  },
  login ({ commit, getters }, { email, password }) {
    if (getters.isAuthed) { return }

    return this.$axios.$post('/auth/login', { email, password })
      .then((data) => {
        const token = data.token
        const payload = data.payload
        commit('SET_TOKEN', { token })
        commit('SET_USER_DATA', { data: payload })
        this.$router.push('/')
        return data
      })
  },
  // Basically deletes token
  // ROADMAP: Switch to stateful auth implementation
  logout ({ commit }) {
    commit('SET_TOKEN', { token: '' })
    commit('SET_USER_DATA', { data: null })
    this.$router.push('/login')
  },
  forgot ({ getters }, { email }) {
    if (getters.isAuthed) { return }

    return this.$axios.$post('/auth/forgot', { email })
  },
  reset ({ getters }, { token, password }) {
    if (getters.isAuthed) { return }

    return this.$axios.$post('/auth/reset', { token, password })
  },
  sendVerify ({ getters }, { email }) {
    if (getters.isAuthed) { return }

    return this.$axios.$post('/auth/send-verify', { email })
  },
  verify ({ getters }, { token }) {
    if (getters.isAuthed) { return }

    return this.$axios.$post('/auth/verify', { token })
  }
}

export const getters = {
  isAuthed (state) {
    return state.token && state.userData
  }
}
