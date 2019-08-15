export const actions = {
  // Init stores in different modules
  async nuxtClientInit ({ dispatch }, ctx) {
    await dispatch('auth/nuxtClientInit', ctx)
  }
}
