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
  let snackbarActions
  let todosActions
  let todosGetters
  let store

  beforeEach(() => {
    authActions = {
      logout: jest.fn()
    }
    snackbarActions = {
      sendSnack: jest.fn()
    }
    todosActions = {
      addTodo: jest.fn().mockResolvedValue(),
      removeTodo: jest.fn().mockResolvedValue(),
      removeTodoDone: jest.fn().mockResolvedValue(),
      setTodoDone: jest.fn().mockResolvedValue()
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
        snackbar: {
          namespaced: true,
          actions: snackbarActions
        },
        todos: {
          namespaced: true,
          actions: todosActions,
          getters: todosGetters
        }
      }
    })
  })

  it('should logout when todo close', async () => {
    expect.assertions(1)
    const wrapper = shallowMount(Todo, { store, localVue })
    wrapper.find(TodoHeader).vm.$emit('close')
    await wrapper.vm.$nextTick()
    expect(authActions.logout).toBeCalled()
  })

  it('should add todo when event add-todo', async () => {
    expect.assertions(3)
    const wrapper = shallowMount(Todo, { store, localVue })
    wrapper.find(TodoInput).vm.$emit('add-todo', {})
    await wrapper.vm.$nextTick()
    expect(todosActions.addTodo).toBeCalled()

    todosActions.addTodo.mockClear()
    todosActions.addTodo.mockRejectedValue(new Error())
    wrapper.find(TodoInput).vm.$emit('add-todo', {})
    await wrapper.vm.$nextTick()
    expect(todosActions.addTodo).toBeCalled()
    expect(snackbarActions.sendSnack).toBeCalled()
  })

  it('should remove done todo when event remove-todo-done', async () => {
    expect.assertions(3)
    const wrapper = shallowMount(Todo, { store, localVue })
    wrapper.find(TodoToolbar).vm.$emit('remove-todo-done')
    await wrapper.vm.$nextTick()
    expect(todosActions.removeTodoDone).toBeCalled()

    todosActions.removeTodoDone.mockClear()
    todosActions.removeTodoDone.mockRejectedValue(new Error())
    wrapper.find(TodoToolbar).vm.$emit('remove-todo-done')
    await wrapper.vm.$nextTick()
    expect(todosActions.removeTodoDone).toBeCalled()
    expect(snackbarActions.sendSnack).toBeCalled()
  })

  it('should set todo done when event set-todo-done', async () => {
    expect.assertions(3)
    const wrapper = shallowMount(Todo, { store, localVue })
    wrapper.find(TodoList).vm.$emit('set-todo-done', {})
    await wrapper.vm.$nextTick()
    expect(todosActions.setTodoDone).toBeCalled()

    todosActions.setTodoDone.mockClear()
    todosActions.setTodoDone.mockRejectedValue(new Error())
    wrapper.find(TodoList).vm.$emit('set-todo-done', {})
    await wrapper.vm.$nextTick()
    expect(todosActions.setTodoDone).toBeCalled()
    expect(snackbarActions.sendSnack).toBeCalled()
  })

  it('should remove todo when event remove-todo', async () => {
    expect.assertions(3)
    const wrapper = shallowMount(Todo, { store, localVue })
    wrapper.find(TodoList).vm.$emit('remove-todo', {})
    await wrapper.vm.$nextTick()
    expect(todosActions.removeTodo).toBeCalled()

    todosActions.removeTodo.mockClear()
    todosActions.removeTodo.mockRejectedValue(new Error())
    wrapper.find(TodoList).vm.$emit('remove-todo', {})
    await wrapper.vm.$nextTick()
    expect(todosActions.removeTodo).toBeCalled()
    expect(snackbarActions.sendSnack).toBeCalled()
  })
})
