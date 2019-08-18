<template>
  <div class="p-3">
    <div class="flex flex-col h-full overflow-y-auto">
      <div class="text-center">
        <h1 class="my-3 text-3xl font-bold">
          Log In
        </h1>
      </div>
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
        <div>
          <label for="password">Password</label>
          <br>
          <input
            id="password"
            v-model="password"
            class="text-box w-full mb-3"
            type="password"
            name="password"
            autocomplete="password"
            required
          >
        </div>
        <div class="flex">
          <div class="flex items-center">
            <nuxt-link to="/forgot">
              Forgot password?
            </nuxt-link>
          </div>
          <div class="flex-1" />
          <button class="btn btn-outline" type="submit">
            Go
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
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      email: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    ...mapActions('auth', [
      'login'
    ]),
    ...mapActions('snackbar', [
      'sendSnack'
    ]),
    async submit () {
      if (this.$refs.form.checkValidity()) {
        await this.login({
          email: this.email,
          password: this.password
        })
          .then(() => {
            this.sendSnack({
              text: 'Log in successful',
              type: 'success'
            })
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
