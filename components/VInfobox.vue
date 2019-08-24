<template>
  <div
    v-show="autoEmptyHide && text"
    class="p-3 rounded text-center"
    :class="boxColor"
  >
    {{ text }}
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    autoEmptyHide: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    boxColor () {
      switch (this.type) {
        case 'info':
          return 'bg-blue-300 text-white'
        case 'success':
          return 'bg-green-400 text-white'
        case 'warning':
          return 'bg-yellow-300'
        case 'error':
          return 'bg-red-400 text-white'
        default:
          return 'bg-gray-400'
      }
    }
  }
}
</script>

<style>

</style>
