<template>
  <div class="container flex flex-col my-3">
    <todo-bar />
    <todo-filter v-model="filter" class="my-3" />
    <todo-list class="flex-1 overflow-x-hidden overflow-y-auto" :todos="filterTodos(filter)" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TodoBar from '~/components/TodoBar.vue'
import TodoFilter from '~/components/TodoFilter.vue'
import TodoList from '~/components/TodoList.vue'

export default {
  components: {
    TodoBar,
    TodoFilter,
    TodoList
  },
  data () {
    return {
      filter: 'all'
    }
  },
  computed: {
    ...mapGetters([
      'filterTodos'
    ])
  }
}
</script>

<style>

</style>
