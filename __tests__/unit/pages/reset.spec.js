import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Reset from '~/pages/Reset.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Page Reset', () => {
  let authActions
  let store
  let mocks

  beforeEach(() => {
    authActions = {
      reset: jest.fn().mockResolvedValue()
    }
    store = new Vuex.Store({
      modules: {
        auth: {
          namespaced: true,
          actions: authActions
        }
      }
    })
    mocks = {
      $route: {
        query: {
          token: '810'
        }
      }
    }
  })

  it('should have a password input', () => {
    const wrapper = shallowMount(Reset, { mocks, store, localVue })
    expect(wrapper.find('input#password')).toBeTruthy()
  })

  it('should submit to store if fields are valid', async () => {
    expect.assertions(3)
    const wrapper = shallowMount(Reset, { mocks, store, localVue })
    wrapper.setData({ password: 'correcthorsebatterystapler' })
    wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()
    expect(authActions.reset).toBeCalled()

    authActions.reset.mockClear()
    authActions.reset.mockRejectedValue(new Error('Error'))
    wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()
    expect(authActions.reset).toBeCalled()
    expect(wrapper.vm.errorMessage).toBe('Error')
  })

  it('should not submit to store if fields are invalid', async () => {
    expect.assertions(1)
    const wrapper = shallowMount(Reset, { mocks, store, localVue })
    wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()
    expect(authActions.reset).not.toBeCalled()
  })
})
