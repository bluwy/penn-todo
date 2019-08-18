<template>
  <div class="flex flex-col">
    <todo-header
      :title="title"
      @close="logoutHandler"
    />
    <todo-input class="p-3" @add-todo="addTodoHandler" />
    <todo-toolbar
      class="px-3"
      :filter="filter"
      :todo-amount="filterTodos('active').length"
      @filter-change="filter = $event.value"
      @remove-todo-done="removeTodoDoneHandler"
    />
    <todo-list
      class="p-3 overflow-hidden flex-1"
      :todos="filterTodos(filter)"
      @set-todo-done="setTodoDoneHandler"
      @remove-todo="removeTodoHandler"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
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
    ...mapGetters('todos', [
      'filterTodos'
    ])
  },
  methods: {
    ...mapActions('auth', [
      'logout'
    ]),
    ...mapActions('snackbar', [
      'sendSnack'
    ]),
    ...mapActions('todos', [
      'addTodo',
      'removeTodo',
      'removeTodoDone',
      'setTodoDone'
    ]),
    logoutHandler () {
      this.logout()
      this.sendSnack({
        text: 'Log out successful',
        type: 'success'
      })
    },
    async addTodoHandler ({ title, done }) {
      await this.addTodo({ title, done })
        .catch((e) => {
          this.sendSnack({
            text: e.message,
            type: 'error'
          })
        })
    },
    async removeTodoHandler ({ id }) {
      await this.removeTodo({ id })
        .catch((e) => {
          this.sendSnack({
            text: e.message,
            type: 'error'
          })
        })
    },
    async removeTodoDoneHandler () {
      await this.removeTodoDone()
        .catch((e) => {
          this.sendSnack({
            text: e.message,
            type: 'error'
          })
        })
    },
    async setTodoDoneHandler ({ id, done }) {
      await this.setTodoDone({ id, done })
        .catch((e) => {
          this.sendSnack({
            text: e.message,
            type: 'error'
          })
        })
    }
  }
}
</script>

<style>

</style>
