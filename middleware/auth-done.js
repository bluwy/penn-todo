import pageVisibility from '~/assets/js/page-visibility.js'

// Opposite of auth.js, redirect to '/' if auth done
export default function ({ store, redirect }) {
  // Since plugins are called before middlewares, nuxtClientInit already checked auth
  if (store.getters['auth/isAuthed']) {
    return redirect('/')
  } else {
    // Check everytime tab gains focus again
    pageVisibility.addListener(async (hidden) => {
      if (!hidden) {
        await store.dispatch('auth/check', null, { root: true })
          .then(() => {
            return redirect('/')
          })
      }
    })
  }
}
