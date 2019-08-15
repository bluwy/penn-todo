import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Signup from '~/pages/signup.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Page Signup', () => {
  let authActions
  let store

  beforeEach(() => {
    authActions = {
      signup: jest.fn()
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

  it('should have a name input', () => {
    const wrapper = shallowMount(Signup, { store, localVue })
    expect(wrapper.find('input#name')).toBeTruthy()
  })

  it('should have an email input', () => {
    const wrapper = shallowMount(Signup, { store, localVue })
    expect(wrapper.find('input#email')).toBeTruthy()
  })

  it('should have a password input', () => {
    const wrapper = shallowMount(Signup, { store, localVue })
    expect(wrapper.find('input#password')).toBeTruthy()
  })

  it('should restrict name at max 16 length', () => {
    expect.assertions(1)
    const wrapper = shallowMount(Signup, { store, localVue })
    expect(wrapper.find('input#name').attributes('maxlength')).toBe('16')
  })

  it('should try submit even if fields are invalid', () => {
    const methods = { submit: jest.fn() }
    const wrapper = shallowMount(Signup, { methods, store, localVue })
    wrapper.find('form').trigger('submit')
    expect(methods.submit).toBeCalled()
  })

  it('should submit to store if fields are valid', () => {
    const wrapper = shallowMount(Signup, { store, localVue })
    wrapper.setData({
      name: 'Bob',
      email: 'test@example.com',
      password: 'correcthorsebatterystapler'
    })
    wrapper.find('form').trigger('submit')
    expect(authActions.signup).toBeCalled()
  })
})
