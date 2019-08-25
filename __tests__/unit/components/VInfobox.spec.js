import { shallowMount } from '@vue/test-utils'
import VInfobox from '~/components/VInfobox.vue'

describe('Component VCheckbox', () => {
  it('should display the text', () => {
    const propsData = { text: 'Text' }
    const wrapper = shallowMount(VInfobox, { propsData })
    expect(wrapper.find('div').text()).toBe('Text')
  })

  it('should hide component if auto empty hide is true and text empty', () => {
    const propsData = { autoEmptyHide: true }
    const wrapper = shallowMount(VInfobox, { propsData })
    expect(wrapper.find('div').isVisible()).toBeFalsy()
  })

  it('should have color for all defined types', () => {
    const wrapper = shallowMount(VInfobox)
    const types = ['info', 'success', 'warning', 'error', 'default']
    types.forEach((type) => {
      wrapper.setProps({ type })
      expect(wrapper.vm.boxColor).toBeTruthy()
    })
  })
})
