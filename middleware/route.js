import pageVisibility from '~/assets/js/page-visibility.js'

export default ({ store, redirect, route }) => {
  const matchMeta = key => route.meta.some(v => v[key])

  pageVisibility.removeListener('requireAuth')
  pageVisibility.removeListener('avoidIfAuth')

  if (matchMeta('requireAuth')) {
    if (!store.getters['auth/isAuthed']) {
      return redirect('/login')
    } else {
      pageVisibility.addListener('requireAuth', async (hidden) => {
        if (!hidden) {
          await store.dispatch('auth/check', null, { root: true })
            .catch(() => redirect('/login'))
        }
      })
    }
  } else if (matchMeta('avoidIfAuth')) {
    if (store.getters['auth/isAuthed']) {
      return redirect('/')
    } else {
      pageVisibility.addListener('avoidIfAuth', async (hidden) => {
        if (!hidden) {
          await store.dispatch('auth/check', null, { root: true })
            .then(() => redirect('/'))
            .catch(() => {})
        }
      })
    }
  }
}
