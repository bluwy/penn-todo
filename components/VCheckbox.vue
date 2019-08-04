<template>
  <span class="relative">
    <input
      type="checkbox"
      class="absolute opacity-0 w-full h-full cursor-pointer"
      :value="value"
      @click="$emit('input', !value)"
    >
    <i class="text-2xl" :class="value ? 'icon-ok-squared text-purple-600' : 'icon-check-empty text-gray-500'" />
  </span>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>

</style>
