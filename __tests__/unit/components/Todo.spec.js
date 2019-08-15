import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Todo from '~/components/Todo.vue'
import TodoHeader from '~/components/TodoHeader.vue'
import TodoInput from '~/components/TodoInput.vue'
import TodoToolbar from '~/components/TodoToolbar.vue'
import TodoList from '~/components/TodoList.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Component Todo', () => {
  let authActions
  let todosActions
  let todosGetters
  let store

  beforeEach(() => {
    authActions = {
      logout: jest.fn()
    }
    todosActions = {
      addTodo: jest.fn(),
      removeTodo: jest.fn(),
      removeTodoDone: jest.fn(),
      setTodoDone: jest.fn()
    }
    todosGetters = {
      filterTodos: jest.fn(() => () => [])
    }
    store = new Vuex.Store({
      modules: {
        auth: {
          namespaced: true,
          actions: authActions
        },
        todos: {
          namespaced: true,
          actions: todosActions,
          getters: todosGetters
        }
      }
    })
  })

  it('should logout when todo close', () => {
    const wrapper = shallowMount(Todo, { store, localVue })
    wrapper.find(TodoHeader).vm.$emit('close')
    expect(authActions.logout).toBeCalled()
  })

  it('should add todo when event add-todo', () => {
    const wrapper = shallowMount(Todo, { store, localVue })
    wrapper.find(TodoInput).vm.$emit('add-todo')
    expect(todosActions.addTodo).toBeCalled()
  })

  it('should remove done todo when event remove-todo-done', () => {
    const wrapper = shallowMount(Todo, { store, localVue })
    wrapper.find(TodoToolbar).vm.$emit('remove-todo-done')
    expect(todosActions.removeTodoDone).toBeCalled()
  })

  it('should set todo done when event set-todo-done', () => {
    const wrapper = shallowMount(Todo, { store, localVue })
    wrapper.find(TodoList).vm.$emit('set-todo-done')
    expect(todosActions.setTodoDone).toBeCalled()
  })

  it('should remove todo when event remove-todo', () => {
    const wrapper = shallowMount(Todo, { store, localVue })
    wrapper.find(TodoList).vm.$emit('remove-todo')
    expect(todosActions.removeTodo).toBeCalled()
  })
})
