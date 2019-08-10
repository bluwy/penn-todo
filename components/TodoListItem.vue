<template>
  <li class="flex flex-sm mb-2">
    <div class="flex items-center">
      <v-checkbox :checked="done" @change="$emit('set-todo-done', { done: $event })" />
    </div>
    <div class="flex-grow flex items-center">
      <span class="text-lg" :class="{ 'line-through text-gray-500': done }">{{ title }}</span>
    </div>
    <button
      class="btn btn-text btn-icon"
      @click="$emit('remove-todo')"
    >
      <i class="icon-cancel" />
    </button>
  </li>
</template>

<script>
import VCheckbox from '~/components/VCheckbox.vue'

export default {
  components: {
    VCheckbox
  },
  props: {
    title: {
      type: String,
      required: true
    },
    done: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>

</style>
