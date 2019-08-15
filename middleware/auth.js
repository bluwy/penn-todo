export default function ({ store, redirect }) {
  if (!store.getters['auth/isAuthed']) {
    return redirect('/login')
  }
}
