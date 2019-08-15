<template>
  <header class="bg-gradient px-3 py-1 text-white">
    <div class="flex justify-between">
      <h1 class="font-semibold">
        {{ title }}
      </h1>
      <button
        class="font-semibold"
        @click="$emit('close')"
      >
        Close
      </button>
    </div>
  </header>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Todo'
    }
  }
}
</script>

<style lang="postcss" scoped>
.bg-gradient {
  @apply bg-purple-600;
  background-image: linear-gradient(to bottom left, #957aea, #805ad5)
}
</style>
