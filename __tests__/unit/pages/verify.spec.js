import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Verify from '~/pages/verify.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Page Verify', () => {
  let authActions
  let store
  let mocks

  beforeEach(() => {
    authActions = {
      verify: jest.fn().mockResolvedValue()
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

  it('s middleware should stay on page if query has token', () => {
    const wrapper = shallowMount(Verify, { mocks, store, localVue })
    const ctx = {
      query: { token: '810' },
      redirect: jest.fn()
    }
    wrapper.vm.$options.middleware(ctx)
    expect(ctx.redirect).not.toBeCalled()
  })

  it('s middleware should redirect if query has no token', () => {
    const wrapper = shallowMount(Verify, { mocks, store, localVue })
    const ctx = {
      query: {},
      redirect: jest.fn()
    }
    wrapper.vm.$options.middleware(ctx)
    expect(ctx.redirect).toBeCalled()
  })

  it('should immediately verify on mounted', async () => {
    expect.assertions(2)
    const wrapper = await shallowMount(Verify, { mocks, store, localVue })
    await wrapper.vm.$nextTick()
    expect(authActions.verify).toBeCalled()
    expect(wrapper.vm.success).toBeTruthy()
  })

  it('should fail verify if token invalid on mounted', async () => {
    expect.assertions(3)
    authActions.verify.mockRejectedValue(new Error('Error'))
    const wrapper = await shallowMount(Verify, { mocks, store, localVue })
    await wrapper.vm.$nextTick()
    expect(authActions.verify).toBeCalled()
    expect(wrapper.vm.success).toBeFalsy()
    expect(wrapper.vm.errorMessage).toBe('Error')
  })
})
