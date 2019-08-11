import { shallowMount } from '@vue/test-utils'
import TodoInput from '~/components/TodoInput.vue'

describe('Component TodoInput', () => {
  it('should call handler when input keyup enter', () => {
    const methods = { addTodoHandler: jest.fn() }
    const wrapper = shallowMount(TodoInput, { methods })
    wrapper.find('input').trigger('keyup.enter')
    expect(methods.addTodoHandler).toBeCalled()
  })

  it('should call handler when button click', () => {
    const methods = { addTodoHandler: jest.fn() }
    const wrapper = shallowMount(TodoInput, { methods })
    wrapper.find('button').trigger('click')
    expect(methods.addTodoHandler).toBeCalled()
  })

  it('should not emit add-todo if title is empty', () => {
    const wrapper = shallowMount(TodoInput)
    wrapper.find('button').trigger('click')
    expect(wrapper.emitted('add-todo')).toBeFalsy()
  })

  it('should clear title after emit add-todo', () => {
    const wrapper = shallowMount(TodoInput)
    wrapper.setData({ todoTitle: '810' })
    wrapper.find('button').trigger('click')
    expect(wrapper.emitted('add-todo')).toBeTruthy()
    expect(wrapper.emitted('add-todo')[0][0]).toEqual({ title: '810' })
    expect(wrapper.vm.todoTitle).toBe('')
  })
})
