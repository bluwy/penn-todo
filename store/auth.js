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
          commit('SET_USER_DATA', { data })
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
  },
  async signup ({ commit, getters }, { name, email, password }) {
    if (getters.isAuthed) { return }

    await this.$axios.$post('/auth/signup', { name, email, password })
      .then((data) => {
        const token = data.token
        const payload = data.payload
        commit('SET_TOKEN', { token })
        commit('SET_USER_DATA', { data: payload })
        this.$router.push('/')
      })
      .catch((err) => {
        console.log(err.message)
      })
  },
  async login ({ commit, getters }, { email, password }) {
    if (getters.isAuthed) { return }

    await this.$axios.$post('/auth/login', { email, password })
      .then((data) => {
        const token = data.token
        const payload = data.payload
        commit('SET_TOKEN', { token })
        commit('SET_USER_DATA', { data: payload })
        this.$router.push('/')
      })
      .catch((err) => {
        console.log(err.message)
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
      .then((data) => {
        return data.preview
      })
      .catch((err) => {
        console.log(err.message)
      })
  },
  async reset ({ getters }, { token, password }) {
    if (getters.isAuthed) { return }

    await this.$axios.$post('/auth/reset', { token, password })
      .then(() => {
        this.$router.push('/login')
      })
      .catch((err) => {
        console.log(err.message)
      })
  }
}

export const getters = {
  isAuthed (state) {
    return state.token && state.userData
  }
}
