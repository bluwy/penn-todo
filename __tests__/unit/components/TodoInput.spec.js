import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import TodoInput from '~/components/TodoInput.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Component TodoInput', () => {
  let actions
  let store

  beforeEach(() => {
    actions = {
      addTodo: jest.fn()
    }
    store = new Vuex.Store({
      actions
    })
  })

  it('should not add todo if title is empty', () => {
    const wrapper = shallowMount(TodoInput, { store, localVue })
    wrapper.find('button').trigger('click')
    expect(actions.addTodo).not.toBeCalled()
  })

  it('should clear title when add todo', () => {
    const propsData = { addTodoTitle: '810' }
    const wrapper = shallowMount(TodoInput, { propsData, store, localVue })
    wrapper.find('button').trigger('click')
    expect(wrapper.vm.addTodoTitle).toBe('')
  })

  it('should try to add todo when keyup enter', () => {
    const methods = { addTodoMethod: jest.fn() }
    const wrapper = shallowMount(TodoInput, { methods, store, localVue })
    wrapper.find('input').trigger('keyup.enter')
    expect(methods.addTodoMethod).toBeCalled()
  })
})
