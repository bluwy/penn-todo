import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import TodoListItem from '~/components/TodoListItem.vue'
import VCheckbox from '~/components/VCheckbox.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Component TodoListItem', () => {
  let actions
  let store

  beforeEach(() => {
    actions = {
      removeTodo: jest.fn(),
      setTodoDone: jest.fn()
    }
    store = new Vuex.Store({
      actions
    })
  })

  const propsData = {
    uid: 1,
    title: 'Todo 1',
    done: false
  }

  it('should update done when checkbox clicked', () => {
    const wrapper = shallowMount(TodoListItem, { propsData, store, localVue })
    wrapper.setMethods({
      // Replace store since store can't access wrapper
      setTodoDone: jest.fn(done => wrapper.setProps({ done }))
    })
    wrapper.find(VCheckbox).vm.$emit('input', true)
    expect(wrapper.vm.setTodoDone).toBeCalled()
    expect(wrapper.vm.done).toBeTruthy()
  })

  it('should remove todo when remove button clicked', () => {
    const wrapper = shallowMount(TodoListItem, { propsData, store, localVue })
    wrapper.find('button').trigger('click')
    expect(actions.removeTodo).toBeCalled()
  })
})
