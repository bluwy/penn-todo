import { shallowMount } from '@vue/test-utils'
import TodoToolbar from '~/components/TodoToolbar.vue'

describe('Component TodoToolbar', () => {
  it('should show the number of todos correctly', () => {
    const propsData = { todoAmount: 810 }
    const wrapper = shallowMount(TodoToolbar, { propsData })
    expect(wrapper.vm.info).toBe('810 todos left')
    wrapper.setProps({ todoAmount: 1 })
    expect(wrapper.vm.info).toBe('1 todo left')
  })

  it('should emit remove-todo-done when button clicked', () => {
    const wrapper = shallowMount(TodoToolbar)
    wrapper.find('button').trigger('click')
    expect(wrapper.emitted('remove-todo-done')).toBeTruthy()
  })

  it('should change filter to all when clicked', () => {
    const wrapper = shallowMount(TodoToolbar)
    wrapper.find('input#all').trigger('click')
    expect(wrapper.emitted('filter-change')).toBeTruthy()
    expect(wrapper.emitted('filter-change')[0][0]).toEqual({ value: 'all' })
  })

  it('should change filter to actiive when clicked', () => {
    const wrapper = shallowMount(TodoToolbar)
    wrapper.find('input#active').trigger('click')
    expect(wrapper.emitted('filter-change')).toBeTruthy()
    expect(wrapper.emitted('filter-change')[0][0]).toEqual({ value: 'active' })
  })

  it('should change filter to done when clicked', () => {
    const wrapper = shallowMount(TodoToolbar)
    wrapper.find('input#done').trigger('click')
    expect(wrapper.emitted('filter-change')).toBeTruthy()
    expect(wrapper.emitted('filter-change')[0][0]).toEqual({ value: 'done' })
  })
})
