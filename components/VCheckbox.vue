<template>
  <span class="relative">
    <input
      type="checkbox"
      class="absolute opacity-0 w-full h-full cursor-pointer"
      v-bind="$attrs"
      :checked="checked"
      v-on="listeners"
    >
    <i class="text-2xl" :class="checked ? 'icon-ok-squared text-purple-600' : 'icon-check-empty text-gray-500'" />
  </span>
</template>

<script>
export default {
  inheritAttrs: false,
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    listeners () {
      return {
        ...this.$listeners,
        change: () => {
          this.$emit('change', !this.checked)
        }
      }
    }
  }
}
</script>

<style>

</style>
