import { shallowMount } from '@vue/test-utils'
import TodoListItem from '~/components/TodoListItem.vue'
import VCheckbox from '~/components/VCheckbox.vue'

describe('Component TodoListItem', () => {
  const propsData = {
    title: 'Todo 1',
    done: false
  }

  it('should display the title', () => {
    const wrapper = shallowMount(TodoListItem, { propsData })
    expect(wrapper.find('span.text-lg').text()).toBe(propsData.title)
  })

  it('should emit set-todo-done when checkbox clicked', () => {
    const wrapper = shallowMount(TodoListItem, { propsData })
    wrapper.find(VCheckbox).vm.$emit('change', true)
    expect(wrapper.emitted('set-todo-done')).toBeTruthy()
    expect(wrapper.emitted('set-todo-done')[0][0]).toEqual({ done: true })
  })

  it('should emit remove-todo when remove button clicked', () => {
    const wrapper = shallowMount(TodoListItem, { propsData })
    wrapper.find('button').trigger('click')
    expect(wrapper.emitted('remove-todo')).toBeTruthy()
  })
})
