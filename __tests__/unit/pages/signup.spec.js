import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Signup from '~/pages/signup.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Page Signup', () => {
  let authActions
  let snackbarActions
  let store

  beforeEach(() => {
    authActions = {
      signup: jest.fn().mockResolvedValue()
    }
    snackbarActions = {
      sendSnack: jest.fn()
    }
    store = new Vuex.Store({
      modules: {
        auth: {
          namespaced: true,
          actions: authActions
        },
        snackbar: {
          namespaced: true,
          actions: snackbarActions
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

  it('should submit to store if fields are valid', async () => {
    expect.assertions(3)
    const wrapper = shallowMount(Signup, { store, localVue })
    wrapper.setData({
      name: 'Bob',
      email: 'test@example.com',
      password: 'correcthorsebatterystapler'
    })
    wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()
    expect(authActions.signup).toBeCalled()

    authActions.signup.mockClear()
    authActions.signup.mockRejectedValue(new Error('Error'))
    wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()
    expect(authActions.signup).toBeCalled()
    expect(wrapper.vm.errorMessage).toBe('Error')
  })

  it('should not submit to store if fields are invalid', async () => {
    expect.assertions(1)
    const wrapper = shallowMount(Signup, { store, localVue })
    wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()
    expect(authActions.signup).not.toBeCalled()
  })
})
