<template>
  <div class="flex flex-col">
    <todo-header :title="title" />
    <todo-input class="p-3" @add-todo="addTodo" />
    <todo-toolbar
      class="px-3"
      :filter="filter"
      :todo-amount="filterTodos('active').length"
      @filter-change="filter = $event.value"
      @remove-todo-done="removeTodoDone"
    />
    <todo-list
      class="p-3 overflow-hidden flex-1"
      :todos="filterTodos(filter)"
      @set-todo-done="setTodoDone"
      @remove-todo="removeTodo"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import TodoHeader from '~/components/TodoHeader.vue'
import TodoInput from '~/components/TodoInput.vue'
import TodoToolbar from '~/components/TodoToolbar.vue'
import TodoList from '~/components/TodoList.vue'

export default {
  components: {
    TodoHeader,
    TodoInput,
    TodoToolbar,
    TodoList
  },
  data () {
    return {
      title: 'Todo',
      filter: 'all'
    }
  },
  computed: {
    ...mapGetters([
      'filterTodos'
    ])
  },
  methods: {
    ...mapActions([
      'addTodo',
      'removeTodo',
      'removeTodoDone',
      'setTodoDone'
    ])
  }
}
</script>

<style>

</style>
