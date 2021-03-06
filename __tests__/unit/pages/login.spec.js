import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Login from '~/pages/login.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Page Login', () => {
  let authActions
  let snackbarActions
  let store
  let mocks

  beforeEach(() => {
    authActions = {
      login: jest.fn().mockResolvedValue(),
      sendVerify: jest.fn().mockResolvedValue()
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
    mocks = {
      $route: {
        params: {}
      }
    }
  })

  it('should have an email input', () => {
    const wrapper = shallowMount(Login, { mocks, store, localVue })
    expect(wrapper.find('input#email')).toBeTruthy()
  })

  it('should have a password input', () => {
    const wrapper = shallowMount(Login, { mocks, store, localVue })
    expect(wrapper.find('input#password')).toBeTruthy()
  })

  it('should submit to store if fields are valid', async () => {
    expect.assertions(3)
    const wrapper = shallowMount(Login, { mocks, store, localVue })
    wrapper.setData({
      email: 'test@example.com',
      password: 'correcthorsebatterystapler'
    })
    wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()
    expect(authActions.login).toBeCalled()

    wrapper.setData({ loginDone: false })
    authActions.login.mockClear()
    authActions.login.mockRejectedValue(new Error('Error'))

    wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()
    expect(authActions.login).toBeCalled()
    expect(wrapper.vm.infoText).toBe('Error')
  })

  it('should not submit to store if fields are invalid', async () => {
    expect.assertions(1)
    const wrapper = shallowMount(Login, { mocks, store, localVue })
    wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()
    expect(authActions.login).not.toBeCalled()
  })

  it('should send verification email if fields are valid but not verified on button clicked', async () => {
    expect.assertions(3)
    const wrapper = shallowMount(Login, { mocks, store, localVue })
    wrapper.setData({
      email: 'test@example.com',
      password: 'correcthorsebatterystapler',
      unverified: true
    })
    wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()
    expect(authActions.sendVerify).toBeCalled()

    authActions.sendVerify.mockClear()
    authActions.sendVerify.mockRejectedValue(new Error('Error'))
    wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()
    expect(authActions.sendVerify).toBeCalled()
    expect(wrapper.vm.infoText).toBe('Error')
  })
})
