import Vue from 'vue'

export const state = () => ({
  // Auto decrement so doesn't crash with database id
  tempId: -1,
  todos: []
})

export const mutations = {
  ADD_TODO (state, { id, title, done }) {
    state.todos.push({ id, title, done })
  },
  // Temporarily assigns a todo with temp id
  // Used by addTodo to later update id was request done
  ADD_TEMP_TODO (state, { title, done }) {
    const id = state.tempId--
    state.todos.push({ id, title, done })
  },
  ADD_TODO_RANGE (state, { todos }) {
    state.todos.push(...todos)
  },
  UPDATE_TODO (state, { index, todo }) {
    // Can't set state.todos[index] directly, reactivity doesn't work that way
    Vue.set(state.todos, index, { ...state.todos[index], ...todo })
  },
  REMOVE_TODO (state, { index }) {
    state.todos.splice(index, 1)
  },
  SET_TODOS (state, { todos }) {
    state.todos = todos
  }
}

export const actions = {
  nuxtClientInit ({ commit }) {
    this.$axios.$get('/todos')
      .then((data) => {
        // data might be empty object if no todos
        if (data.hasOwnProperty('todos')) {
          commit('ADD_TODO_RANGE', { todos: data.todos })
        }
      })
      .catch((err) => {
        console.log(err.message)
      })
  },
  // Returns todo id after add
  async addTodo ({ commit, state, getters }, { title, done }) {
    // Cache temp id, when add temp todo, state's tempId will auto decrement
    const tempId = state.tempId
    commit('ADD_TEMP_TODO', { title, done })

    const index = getters.getTodoIndex(tempId)

    await this.$axios.$post('/todos/add', { title, done })
      .then((data) => {
        const id = data.id
        commit('UPDATE_TODO', {
          index,
          todo: { id }
        })
        return id
      })
      .catch((err) => {
        console.log(err.message)
        // Delete the temp todo
        commit('REMOVE_TODO', { index })
      })
  },
  async removeTodo ({ commit, state, getters }, { id }) {
    const index = getters.getTodoIndex(id)
    if (index < 0) { return }

    const cacheTodo = state.todos[index]

    commit('REMOVE_TODO', { index })
    await this.$axios.$delete('/todos/' + id)
      .catch((err) => {
        console.log(err.message)
        // Add back todo
        commit('ADD_TODO', cacheTodo)
      })
  },
  async removeTodoDone ({ commit, state }) {
    if (state.todos.findIndex(todo => todo.done) < 0) { return }

    const cacheTodos = { ...state.todos }

    commit('SET_TODOS', {
      todos: state.todos.filter(t => !t.done)
    })

    await this.$axios.$delete('/todos/done')
      .catch((err) => {
        console.log(err.message)
        // Add back todos
        commit('SET_TODOS', { todos: cacheTodos })
      })
  },
  async setTodoTitle ({ commit, state, getters }, { id, title }) {
    const index = getters.getTodoIndex(id)
    if (index < 0) { return }

    const cacheTitle = state.todos[index].title

    commit('UPDATE_TODO', {
      index,
      todo: { title }
    })

    await this.$axios.$put('/todos/title/' + id, { title })
      .catch((err) => {
        console.log(err)
        // Revert title
        commit('UPDATE_TODO', {
          index,
          todo: { title: cacheTitle }
        })
      })
  },
  async setTodoDone ({ commit, state, getters }, { id, done }) {
    const index = getters.getTodoIndex(id)
    if (index < 0) { return }

    const cacheDone = state.todos[index].done

    commit('UPDATE_TODO', {
      index,
      todo: { done }
    })

    await this.$axios.$put('/todos/done/' + id, { done: done.toString() })
      .catch((err) => {
        console.log(err)
        // Revert done
        commit('UPDATE_TODO', {
          index,
          todo: { done: cacheDone.toString() }
        })
      })
  }
}

export const getters = {
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
