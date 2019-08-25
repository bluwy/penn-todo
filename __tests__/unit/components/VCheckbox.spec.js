import { shallowMount } from '@vue/test-utils'
import VCheckbox from '~/components/VCheckbox.vue'

describe('Component VCheckbox', () => {
  it('should display the correct icon', () => {
    const propsData = { checked: false }
    const wrapper = shallowMount(VCheckbox, { propsData })
    expect(wrapper.find('i').classes('icon-check-empty')).toBeTruthy()
    wrapper.setProps({ checked: true })
    expect(wrapper.find('i').classes('icon-ok-squared')).toBeTruthy()
  })

  it('should emit change when click', () => {
    const propsData = { checked: false }
    const wrapper = shallowMount(VCheckbox, { propsData })
    wrapper.find('input').trigger('change')
    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')[0][0]).toBeTruthy()
  })
})
