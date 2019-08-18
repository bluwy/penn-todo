<template>
  <div class="p-3">
    <div class="flex flex-col h-full overflow-y-auto">
      <div class="text-center">
        <h1 class="my-3 text-3xl font-bold">
          Sign Up
        </h1>
      </div>
      <span v-show="errorMessage" class="error-box">{{ errorMessage }}</span>
      <form ref="form" @submit.prevent="submit">
        <div>
          <label for="name">Name</label>
          <br>
          <input
            id="name"
            v-model="name"
            class="text-box w-full mb-3"
            type="text"
            name="name"
            autocomplete="name"
            maxlength="16"
            required
          >
        </div>
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
        <div class="text-right">
          <button class="btn btn-outline" type="submit">
            Go
          </button>
        </div>
      </form>
      <div class="flex-1" />
      <span class="text-center">
        Already have an account? <nuxt-link to="login">Log in now!</nuxt-link>
      </span>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      name: '',
      email: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    ...mapActions('auth', [
      'signup'
    ]),
    ...mapActions('snackbar', [
      'sendSnack'
    ]),
    async submit () {
      if (this.$refs.form.checkValidity()) {
        await this.signup({
          name: this.name,
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
