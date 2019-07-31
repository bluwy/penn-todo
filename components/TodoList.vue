<template>
  <ul>
    <todo-list-item
      v-for="todo in todos"
      :key="todo.index"
      :title="todo.title"
      :done="todo.done"
      :index="todo.index"
    />
    <li
      v-show="!todos || todos.length <= 0"
      class="text-center text-gray-500"
    >
      No todos
    </li>
  </ul>
</template>

<script>
import TodoListItem from '~/components/TodoListItem.vue'

export default {
  components: {
    TodoListItem
  },
  props: {
    todos: {
      type: Array,
      required: true
    }
  }
}
</script>

<style>

</style>
