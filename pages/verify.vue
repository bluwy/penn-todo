<template>
  <div class="p-3">
    <div class="flex flex-col h-full overflow-y-auto">
      <div class="text-center">
        <h1 class="my-3 text-3xl font-bold">
          Verify Account
        </h1>
      </div>
      <span v-show="errorMessage" class="error-box">{{ errorMessage }}</span>
      <div class="text-center">
        <p class="text-xl">
          {{ status }}
        </p>
        <nuxt-link v-show="success" to="/login">
          Proceed to login
        </nuxt-link>
      </div>
      <div class="flex-1" />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  middleware ({ query, redirect }) {
    if (!query.token) {
      redirect('/login')
    }
  },
  data () {
    return {
      status: 'Verifying...',
      success: false,
      errorMessage: ''
    }
  },
  mounted () {
    this.verify({ token: this.$route.query.token })
      .then(() => {
        this.status = 'Account verified!'
        this.success = true
      })
      .catch((e) => {
        this.status = 'Account not verified'
        this.success = false
        this.errorMessage = e.message
      })
  },
  methods: {
    ...mapActions('auth', [
      'verify'
    ])
  }
}
</script>

<style>

</style>
