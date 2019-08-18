<template>
  <div class="wrapper sm:max-w-lg" :class="{ 'show': show }">
    <div class="flex p-3 w-full rounded shadow-2xl" :class="snackColor">
      <div class="flex items-center flex-1">
        <span class="pl-2">
          {{ currentSnack.text }}
        </span>
      </div>
      <button
        class="btn btn-icon"
        @click="hide"
      >
        <i class="icon-cancel" />
      </button>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const { mapState } = createNamespacedHelpers('snackbar')

export default {
  data () {
    return {
      snacks: [],
      currentSnack: {},
      show: false,
      showTime: 5000,
      animTime: 200,
      promise: Promise.resolve(),
      next: null
    }
  },
  computed: {
    ...mapState([
      'snack'
    ]),
    snackColor () {
      const type = this.currentSnack.type
      return {
        'bg-gray-400': type === 'default',
        'bg-blue-400 text-white': type === 'info',
        'bg-green-400 text-white': type === 'success',
        'bg-yellow-400 text-white': type === 'warning',
        'bg-red-400 text-white': type === 'error'
      }
    }
  },
  watch: {
    snack (val) {
      this.snacks.push(val)
      this.promise = this.promise
        .then(() => {
          return new Promise((resolve) => {
            this.currentSnack = this.snacks.shift()
            this.show = true

            // Ugly code below:
            // 2. Unshow the snack and resolve
            const unshow = () => {
              this.show = false
              this.next = null
              setTimeout(() => resolve(), this.animTime)
            }

            // 1. Wait for showTime before unshow
            const timeout = setTimeout(() => unshow(), this.showTime)

            // 3. Set the next so we can call it to skip showTime and unshow immediately
            this.next = () => {
              clearTimeout(timeout)
              unshow()
            }
          })
        })
    }
  },
  methods: {
    hide () {
      if (this.next) {
        this.next()
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.wrapper {
  @apply fixed p-3 w-full;
  top: 100%;
  left: 50%;
  opacity: 0;
  transform: translateX(-50%) translateY(0);
  transition: transform .2s cubic-bezier(0.39, 0.575, 0.565, 1), opacity .2s cubic-bezier(0.39, 0.575, 0.565, 1);
}
.wrapper.show {
  opacity: 1;
  transform: translateX(-50%) translateY(-100%);
}
</style>
