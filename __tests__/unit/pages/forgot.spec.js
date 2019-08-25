import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Forgot from '~/pages/forgot.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Page Forgot', () => {
  let authActions
  let store

  beforeEach(() => {
    authActions = {
      forgot: jest.fn().mockResolvedValue()
    }
    store = new Vuex.Store({
      modules: {
        auth: {
          namespaced: true,
          actions: authActions
        }
      }
    })
  })

  it('should have an email input', () => {
    const wrapper = shallowMount(Forgot, { store, localVue })
    expect(wrapper.find('input#email')).toBeTruthy()
  })

  it('should submit to store if fields are valid', async () => {
    expect.assertions(3)
    const wrapper = shallowMount(Forgot, { store, localVue })
    wrapper.setData({ email: 'test@example.com' })
    wrapper.find('form').trigger('submit')
    expect(authActions.forgot).toBeCalled()

    wrapper.setData({ emailSent: false })
    authActions.forgot.mockClear()
    authActions.forgot.mockRejectedValue(new Error('Error'))
    wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()
    expect(authActions.forgot).toBeCalled()
    expect(wrapper.vm.infoText).toBe('Error')
  })

  it('should not submit to store if fields are invalid', async () => {
    expect.assertions(1)
    const wrapper = shallowMount(Forgot, { store, localVue })
    wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()
    expect(authActions.forgot).not.toBeCalled()
  })
})
