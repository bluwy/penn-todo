<template>
  <div class="flex flex-sm">
    <input
      id="add-todo"
      v-model="addTodoTitle"
      class="flex-grow text-box"
      type="text"
      name="add-todo"
      placeholder="Anything to do?"
      @keyup="todoKeyUp"
    >
    <button
      class="btn btn-outline btn-icon"
      @click="addTodoMethod"
    >
      <i class="icon-plus" />
    </button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      addTodoTitle: ''
    }
  },
  methods: {
    ...mapActions([
      'addTodo'
    ]),
    addTodoMethod () {
      if (this.addTodoTitle) {
        this.addTodo(this.addTodoTitle)
        this.addTodoTitle = ''
      }
    },
    todoKeyUp (evt) {
      if (evt.keyCode === 13) {
        this.addTodoMethod()
      }
    }
  }
}
</script>

<style>

</style>
