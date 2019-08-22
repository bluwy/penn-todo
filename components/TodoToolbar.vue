<template>
  <div class="flex flex-wrap">
    <div class="w-6/12 sm:flex-1 flex items-center">
      <span>{{ info }}</span>
    </div>
    <div class="order-last w-full sm:order-none sm:w-auto flex justify-center">
      <span>
        <input
          id="all"
          class="filter-radio"
          type="radio"
          name="filter-group"
          value="all"
          :checked="filter === 'all'"
          @click="$emit('filter-change', { value: $event.target.value })"
        >
        <label class="radio-label" for="all">
          All
        </label>
      </span>
      <span>
        <input
          id="active"
          class="filter-radio"
          type="radio"
          name="filter-group"
          value="active"
          :checked="filter === 'active'"
          @click="$emit('filter-change', { value: $event.target.value })"
        >
        <label class="radio-label" for="active">Active</label>
      </span>
      <span>
        <input
          id="done"
          class="filter-radio"
          type="radio"
          name="filter-group"
          value="done"
          :checked="filter === 'done'"
          @click="$emit('filter-change', { value: $event.target.value })"
        >
        <label class="radio-label" for="done">Done</label>
      </span>
    </div>
    <div class="w-6/12 sm:flex-1 text-right">
      <button class="btn btn-text" @click="$emit('remove-todo-done')">
        <i class="icon-cancel" />
        Clear done
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    filter: {
      type: String,
      default: 'all'
    },
    todoAmount: {
      type: Number,
      default: 0
    }
  },
  computed: {
    info () {
      const s = this.todoAmount !== 1 ? 's' : ''
      return `${this.todoAmount} todo${s} left`
    }
  }
}
</script>

<style lang="postcss" scoped>
.filter-radio {
  display: none;
}

.radio-label {
  @apply inline-block px-3 py-1 border-b-2;
  transition: all .3s cubic-bezier(.4, 0, .2, 1);
}
.radio-label:hover, .radio-label:focus {
  @apply border-purple-300;
}
.filter-radio:checked + .radio-label {
  @apply border-purple-500;
}
</style>
