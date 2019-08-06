import { shallowMount } from '@vue/test-utils'
import VCheckbox from '~/components/VCheckbox.vue'

describe('Component VCheckbox', () => {
  it('should emit input when click', () => {
    const propsData = { value: false }
    const wrapper = shallowMount(VCheckbox, { propsData })
    wrapper.find('input').trigger('click')
    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')[0][0]).toBe(true)
  })
})
