<template>
  <div>
    <ul class="h-full overflow-x-hidden">
      <todo-list-item
        v-for="todo in todos"
        :key="todo.id"
        :title="todo.title"
        :done="todo.done"
        @set-todo-done="$emit('set-todo-done', { ...$event, id: todo.id })"
        @remove-todo="$emit('remove-todo', { id: todo.id })"
      />
      <li
        v-show="!todos || todos.length <= 0"
        class="text-center text-gray-500"
      >
        No todos
      </li>
    </ul>
  </div>
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
