import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import TodoBar from '~/components/TodoBar.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Component TodoBar', () => {
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
    const wrapper = shallowMount(TodoBar, { store, localVue })
    wrapper.find('button').trigger('click')
    expect(actions.addTodo).not.toBeCalled()
  })

  it('should clear title when add todo', () => {
    const propsData = { addTodoTitle: '810' }
    const wrapper = shallowMount(TodoBar, { propsData, store, localVue })
    wrapper.find('button').trigger('click')
    expect(wrapper.vm.addTodoTitle).toBe('')
  })

  it('should try to add todo when keyup enter', () => {
    const methods = { addTodoMethod: jest.fn() }
    const wrapper = shallowMount(TodoBar, { methods, store, localVue })
    wrapper.find('input').trigger('keyup.enter')
    expect(methods.addTodoMethod).toBeCalled()
  })
})
