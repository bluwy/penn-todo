const JWT_TOKEN = 'jwtToken'

export const state = () => ({
  token: localStorage.getItem(JWT_TOKEN) || '',
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
  async nuxtClientInit ({ state, commit }) {
    const token = state.token
    if (token) {
      await this.$axios.$post('/auth/check', { token })
        .then((data) => {
          commit('SET_TOKEN', { token })
          commit('SET_USER_DATA', { data })
        })
        .catch(() => {
          commit('SET_TOKEN', { token: '' })
          commit('SET_USER_DATA', { data: null })
        })
    }
  },
  signup ({ commit, getters }, { name, email, password }) {
    if (getters.isAuthed) { return }

    return this.$axios.$post('/auth/signup', { name, email, password })
      .then((data) => {
        const token = data.token
        const payload = data.payload
        commit('SET_TOKEN', { token })
        commit('SET_USER_DATA', { data: payload })
        this.$router.push('/')
        return data
      })
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
      .then(() => {
        this.$router.push('/login')
      })
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
