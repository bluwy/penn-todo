<template>
  <div class="flex rounded overflow-hidden">
    <div>
      <input
        id="all"
        class="filter-radio"
        type="radio"
        name="filter-group"
        value="all"
        :checked="filter === 'all'"
        @click="$emit('input', $event.target.value)"
      >
      <label class="radio-label" for="all">
        All
      </label>
    </div>
    <div>
      <input
        id="active"
        class="filter-radio"
        type="radio"
        name="filter-group"
        value="active"
        :checked="filter === 'active'"
        @click="$emit('input', $event.target.value)"
      >
      <label class="radio-label" for="active">Active</label>
    </div>
    <div>
      <input
        id="done"
        class="filter-radio"
        type="radio"
        name="filter-group"
        value="done"
        :checked="filter === 'done'"
        @click="$emit('input', $event.target.value)"
      >
      <label class="radio-label" for="done">Done</label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: 'all'
    }
  },
  data () {
    return {
      filter: ''
    }
  },
  watch: {
    value (val) {
      this.filter = val
    }
  },
  mounted () {
    this.filter = this.value
  }
}
</script>

<style lang="postcss">
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
