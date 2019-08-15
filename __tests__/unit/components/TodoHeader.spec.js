import { shallowMount } from '@vue/test-utils'
import TodoHeader from '~/components/TodoHeader.vue'

describe('Component TodoHeader', () => {
  it('should display the title correctly', () => {
    const propsData = { title: '810' }
    const wrapper = shallowMount(TodoHeader, { propsData })
    expect(wrapper.find('h1').text()).toBe(propsData.title)
  })

  it('should emit close when click close', () => {
    const wrapper = shallowMount(TodoHeader)
    wrapper.find('button').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
