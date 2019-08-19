import { shallowMount } from '@vue/test-utils'
import Home from '~/pages/index.vue'
import Todo from '~/components/Todo.vue'

describe('Page Home', () => {
  it('should render a todo', () => {
    const wrapper = shallowMount(Home)
    expect(wrapper.find(Todo).exists()).toBeTruthy()
  })

  it('s fetch should dispatch store to fetch todos', async () => {
    expect.assertions(1)
    const wrapper = shallowMount(Home)
    const ctx = {
      store: { dispatch: jest.fn().mockResolvedValue() }
    }
    await wrapper.vm.$options.fetch(ctx)
    expect(ctx.store.dispatch).toBeCalled()
  })
})
