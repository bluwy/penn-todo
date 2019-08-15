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
      forgot: jest.fn()
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

  it('should try submit even if fields are invalid', () => {
    const methods = { submit: jest.fn() }
    const wrapper = shallowMount(Forgot, { methods, store, localVue })
    wrapper.find('form').trigger('submit')
    expect(methods.submit).toBeCalled()
  })

  it('should submit to store if fields are valid', () => {
    const wrapper = shallowMount(Forgot, { store, localVue })
    wrapper.setData({
      email: 'test@example.com'
    })
    wrapper.find('form').trigger('submit')
    expect(authActions.forgot).toBeCalled()
  })
})
