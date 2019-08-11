import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Todo from '~/components/Todo.vue'
import TodoInput from '~/components/TodoInput.vue'
import TodoToolbar from '~/components/TodoToolbar.vue'
import TodoList from '~/components/TodoList.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Components Todo', () => {
  let actions
  let getters
  let store

  beforeEach(() => {
    actions = {
      addTodo: jest.fn(),
      removeTodo: jest.fn(),
      removeTodoDone: jest.fn(),
      setTodoDone: jest.fn()
    }
    getters = {
      filterTodos: jest.fn(() => () => [])
    }
    store = new Vuex.Store({
      actions,
      getters
    })
  })

  it('should add todo when event add-todo', () => {
    const wrapper = shallowMount(Todo, { store, localVue })
    wrapper.find(TodoInput).vm.$emit('add-todo')
    expect(actions.addTodo).toBeCalled()
  })

  it('should remove done todo when event remove-todo-done', () => {
    const wrapper = shallowMount(Todo, { store, localVue })
    wrapper.find(TodoToolbar).vm.$emit('remove-todo-done')
    expect(actions.removeTodoDone).toBeCalled()
  })

  it('should set todo done when event set-todo-done', () => {
    const wrapper = shallowMount(Todo, { store, localVue })
    wrapper.find(TodoList).vm.$emit('set-todo-done')
    expect(actions.setTodoDone).toBeCalled()
  })

  it('should remove todo when event remove-todo', () => {
    const wrapper = shallowMount(Todo, { store, localVue })
    wrapper.find(TodoList).vm.$emit('remove-todo')
    expect(actions.removeTodo).toBeCalled()
  })
})
