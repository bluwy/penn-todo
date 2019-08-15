<template>
  <todo />
</template>

<script>
import Todo from '~/components/Todo.vue'

export default {
  middleware: 'auth',
  components: {
    Todo
  },
  async fetch ({ store }) {
    await store.dispatch('todos/fetchTodos')
  }
}
</script>

<style>

</style>
