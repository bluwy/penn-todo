import { shallowMount } from '@vue/test-utils'
import Home from '~/pages/index.vue'
import Todo from '~/components/Todo.vue'

describe('Pages Home', () => {
  it('should render a todo', () => {
    const wrapper = shallowMount(Home)
    expect(wrapper.find(Todo).exists()).toBeTruthy()
  })
})
