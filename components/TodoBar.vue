<template>
  <div class="flex flex-sm">
    <input
      id="add-todo"
      v-model="todoTitle"
      class="flex-grow text-box"
      type="text"
      name="add-todo"
      placeholder="Anything to do?"
      maxlength="256"
      @keyup.enter="addTodoHandler"
    >
    <button
      class="btn btn-outline btn-icon"
      @click="addTodoHandler"
    >
      <i class="icon-plus" />
    </button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      todoTitle: ''
    }
  },
  methods: {
    addTodoHandler () {
      this.$emit('add-todo', { title: this.todoTitle })
      this.todoTitle = ''
    }
  }
}
</script>

<style>

</style>
