<template>
  <div class="flex flex-col">
    <todo-header :title="title" />
    <todo-bar class="p-3" @add-todo="addTodo" />
    <todo-filter
      v-model="filter"
      class="px-3"
      :todo-amount="filterTodos('active').length"
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
import TodoBar from '~/components/TodoBar.vue'
import TodoFilter from '~/components/TodoFilter.vue'
import TodoList from '~/components/TodoList.vue'

export default {
  components: {
    TodoHeader,
    TodoBar,
    TodoFilter,
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
