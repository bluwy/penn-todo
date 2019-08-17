import Vue from 'vue'

export const state = () => ({
  // Auto decrement so doesn't crash with database id
  tempId: -1,
  todos: []
})

export const mutations = {
  SET_TODOS (state, { todos }) {
    state.todos = todos
  },
  ADD_TODO (state, { id, title, done }) {
    state.todos.push({ id, title, done })
  },
  // Temporarily assigns a todo with temp id
  // Used by addTodo to later update id was request done
  ADD_TEMP_TODO (state, { title, done }) {
    const id = state.tempId--
    state.todos.push({ id, title, done })
  },
  UPDATE_TODO (state, { index, todo }) {
    // Can't set state.todos[index] directly, reactivity doesn't work that way
    Vue.set(state.todos, index, { ...state.todos[index], ...todo })
  },
  REMOVE_TODO (state, { index }) {
    state.todos.splice(index, 1)
  }
}

export const actions = {
  // Fetch on page fetch
  fetchTodos ({ commit, getters }) {
    if (!getters.isAuthed) { return }

    return this.$axios.$get('/todos/')
      .then((data) => {
        const todos = data.todos || []
        commit('SET_TODOS', { todos })
        return data
      })
  },
  // Returns todo id after add
  addTodo ({ commit, state, getters }, { title, done }) {
    if (!getters.isAuthed) { return }

    // Cache temp id, when add temp todo, state's tempId will auto decrement
    const tempId = state.tempId
    commit('ADD_TEMP_TODO', { title, done })

    const index = getters.getTodoIndex(tempId)

    return this.$axios.$post('/todos/add', { title, done })
      .then((data) => {
        const id = data.id
        commit('UPDATE_TODO', {
          index,
          todo: { id }
        })
        return data
      })
      .catch((err) => {
        // Delete the temp todo
        commit('REMOVE_TODO', { index })
        return Promise.reject(err)
      })
  },
  removeTodo ({ commit, state, getters }, { id }) {
    if (!getters.isAuthed) { return }

    const index = getters.getTodoIndex(id)
    if (index < 0) { return }

    const cacheTodo = state.todos[index]

    commit('REMOVE_TODO', { index })

    return this.$axios.$delete('/todos/' + id)
      .catch((err) => {
        // Add back todo
        commit('ADD_TODO', cacheTodo)
        return Promise.reject(err)
      })
  },
  removeTodoDone ({ commit, state, getters }) {
    if (!getters.isAuthed) { return }
    if (state.todos.findIndex(todo => todo.done) < 0) { return }

    const cacheTodos = { ...state.todos }

    commit('SET_TODOS', {
      todos: state.todos.filter(t => !t.done)
    })

    return this.$axios.$delete('/todos/done')
      .catch((err) => {
        // Add back todos
        commit('SET_TODOS', { todos: cacheTodos })
        return Promise.reject(err)
      })
  },
  setTodoTitle ({ commit, state, getters }, { id, title }) {
    if (!getters.isAuthed) { return }

    const index = getters.getTodoIndex(id)
    if (index < 0) { return }

    const cacheTitle = state.todos[index].title

    commit('UPDATE_TODO', {
      index,
      todo: { title }
    })

    return this.$axios.$put('/todos/title/' + id, { title })
      .catch((err) => {
        // Revert title
        commit('UPDATE_TODO', {
          index,
          todo: { title: cacheTitle }
        })
        return Promise.reject(err)
      })
  },
  setTodoDone ({ commit, state, getters }, { id, done }) {
    if (!getters.isAuthed) { return }

    const index = getters.getTodoIndex(id)
    if (index < 0) { return }

    const cacheDone = state.todos[index].done

    commit('UPDATE_TODO', {
      index,
      todo: { done }
    })

    return this.$axios.$put('/todos/done/' + id, { done: done.toString() })
      .catch((err) => {
        // Revert done
        commit('UPDATE_TODO', {
          index,
          todo: { done: cacheDone.toString() }
        })
        return Promise.reject(err)
      })
  }
}

export const getters = {
  isAuthed (state, getters, rootState, rootGetters) {
    return rootGetters['auth/isAuthed']
  },
  filterTodos: state => (filter) => {
    switch (filter) {
      case 'all':
        return state.todos
      case 'active':
        return state.todos.filter(todo => !todo.done)
      case 'done':
        return state.todos.filter(todo => todo.done)
      default:
        return state.todos
    }
  },
  getTodoIndex: state => (id) => {
    return state.todos.findIndex(todo => todo.id === id)
  }
}
