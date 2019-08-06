import { shallowMount } from '@vue/test-utils'
import TodoList from '~/components/TodoList.vue'
import TodoListItem from '~/components/TodoListItem.vue'

describe('Component TodoList', () => {
  const testDatas = [
    {
      uid: 1,
      title: 'Todo 1',
      done: false
    },
    {
      uid: 2,
      title: 'Todo 2',
      done: true
    }
  ]

  it('should render the same amount of todo list item as given', () => {
    const propsData = { todos: testDatas }
    const wrapper = shallowMount(TodoList, { propsData })
    expect(wrapper.findAll(TodoListItem).length).toBe(2)
  })

  it('should give feedback when no todos', () => {
    const propsData = { todos: [] }
    const wrapper = shallowMount(TodoList, { propsData })
    expect(wrapper.find('li').text()).toMatch('No todos')
  })
})
