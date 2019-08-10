import { shallowMount } from '@vue/test-utils'
import TodoToolbar from '~/components/TodoToolbar.vue'

describe('Component TodoToolbar', () => {
  it('should change filter to all when clicked', () => {
    const wrapper = shallowMount(TodoToolbar)
    wrapper.find('input#all').trigger('click')
    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')[0][0]).toBe('all')
  })

  it('should change filter to actiive when clicked', () => {
    const wrapper = shallowMount(TodoToolbar)
    wrapper.find('input#active').trigger('click')
    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')[0][0]).toBe('active')
  })

  it('should change filter to done when clicked', () => {
    const wrapper = shallowMount(TodoToolbar)
    wrapper.find('input#done').trigger('click')
    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')[0][0]).toBe('done')
  })
})
