<template>
  <div class="p-3">
    <div class="flex flex-col h-full overflow-y-auto">
      <h1 class="my-3 text-3xl font-bold text-center">
        Forgot Password
      </h1>
      <span class="my-3 text-center">Enter your email below to send a "reset password" email</span>
      <span v-show="errorMessage" class="error-box">{{ errorMessage }}</span>
      <form ref="form" @submit.prevent="submit">
        <div>
          <label for="email">Email</label>
          <br>
          <input
            id="email"
            v-model="email"
            class="text-box w-full mb-3"
            type="email"
            name="email"
            autocomplete="email"
            required
          >
        </div>
        <div class="text-right">
          <button class="btn btn-outline" type="submit">
            Send
          </button>
        </div>
      </form>
      <div class="flex-1" />
      <span class="text-center">
        No account? <nuxt-link to="signup">Create one now!</nuxt-link>
      </span>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const { mapActions } = createNamespacedHelpers('auth')

export default {
  data () {
    return {
      email: '',
      errorMessage: ''
    }
  },
  methods: {
    ...mapActions([
      'forgot'
    ]),
    async submit () {
      if (this.$refs.form.checkValidity()) {
        await this.forgot({ email: this.email })
          .then((data) => {
            this.errorMessage = 'Preview email at ' + data.preview
          })
          .catch((e) => {
            this.errorMessage = e.message
          })
      }
    }
  }
}
</script>

<style>

</style>
