<template>
  <div>
    <ul class="h-full overflow-x-hidden">
      <todo-list-item
        v-for="todo in todos"
        :key="todo.uid"
        :title="todo.title"
        :done="todo.done"
        @set-todo-done="$emit('set-todo-done', { ...$event, uid: todo.uid })"
        @remove-todo="$emit('remove-todo', { uid: todo.uid })"
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
