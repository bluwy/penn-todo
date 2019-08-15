import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Login from '~/pages/login.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Page Login', () => {
  let authActions
  let store

  beforeEach(() => {
    authActions = {
      login: jest.fn()
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
    const wrapper = shallowMount(Login, { store, localVue })
    expect(wrapper.find('input#email')).toBeTruthy()
  })

  it('should have a password input', () => {
    const wrapper = shallowMount(Login, { store, localVue })
    expect(wrapper.find('input#password')).toBeTruthy()
  })

  it('should try submit even if fields are invalid', () => {
    const methods = { submit: jest.fn() }
    const wrapper = shallowMount(Login, { methods, store, localVue })
    wrapper.find('form').trigger('submit')
    expect(methods.submit).toBeCalled()
  })

  it('should submit to store if fields are valid', () => {
    const wrapper = shallowMount(Login, { store, localVue })
    wrapper.setData({
      email: 'test@example.com',
      password: 'correcthorsebatterystapler'
    })
    wrapper.find('form').trigger('submit')
    expect(authActions.login).toBeCalled()
  })
})
