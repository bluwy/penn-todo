<template>
  <div class="flex justify-between">
    <div class="flex-1 flex items-center">
      <span>{{ info }}</span>
    </div>
    <div class="flex">
      <span>
        <input
          id="all"
          class="filter-radio"
          type="radio"
          name="filter-group"
          value="all"
          :checked="value === 'all'"
          @click="$emit('input', $event.target.value)"
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
          :checked="value === 'active'"
          @click="$emit('input', $event.target.value)"
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
          :checked="value === 'done'"
          @click="$emit('input', $event.target.value)"
        >
        <label class="radio-label" for="done">Done</label>
      </span>
    </div>
    <div class="flex-1 text-right">
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
    value: {
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
