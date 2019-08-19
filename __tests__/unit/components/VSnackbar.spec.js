import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import { wait } from '~/assets/js/utils'
import VSnackbar from '~/components/VSnackbar.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Component VSnackbar', () => {
  let snackbarState
  let store

  beforeEach(() => {
    snackbarState = () => ({
      snack: {}
    })
    store = new Vuex.Store({
      modules: {
        snackbar: {
          namespaced: true,
          state: snackbarState
        }
      }
    })
  })

  it('should show, wait and hide snack when snack value change', async () => {
    expect.assertions(3)
    const wrapper = shallowMount(VSnackbar, { store, localVue })
    // Set shorter time for test
    wrapper.setData({
      showTime: 10,
      animTime: 0
    })
    // Set snack, will trigger watcher that chains promise (async)
    const snack = {
      text: '810',
      type: 'success'
    }
    store.state.snackbar.snack = snack
    expect(wrapper.vm.snacks).toContain(snack)
    // Wait on next queue since the animation uses promise
    await wait(0)
    expect(wrapper.vm.show).toBeTruthy()
    await wait(wrapper.vm.animTime + wrapper.vm.showTime)
    expect(wrapper.vm.show).toBeFalsy()
  })

  it('should call next if exist when close button clicked', () => {
    const wrapper = shallowMount(VSnackbar, { store, localVue })
    // Plain call, nothing should happen since next doesn't exist (For code coverage)
    wrapper.find('button').trigger('click')
    wrapper.setData({ next: jest.fn() })
    wrapper.find('button').trigger('click')
    expect(wrapper.vm.next).toBeCalled()
  })
})
