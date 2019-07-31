export const state = () => ({
  todoIndex: 0,
  todos: [
    {
      index: 0,
      title: 'Hello world!',
      done: false
    }
  ]
})

export const mutations = {
  ADD_TODO (state, title) {
    state.todos.push({
      index: ++state.todoIndex,
      title,
      done: false
    })
  },
  REMOVE_TODO (state, index) {
    state.todos = state.todos.filter(todo => todo.index !== index)
  },
  SET_TODO_DONE (state, { index, val }) {
    state.todos.forEach((todo) => {
      if (todo.index === index) {
        todo.done = val
      }
    })
  }
}

export const actions = {
  addTodo ({ commit }, title) {
    commit('ADD_TODO', title)
  },
  removeTodo ({ commit }, index) {
    commit('REMOVE_TODO', index)
  },
  setTodoDone ({ commit }, { index, val }) {
    commit('SET_TODO_DONE', { index, val })
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
  }
}
