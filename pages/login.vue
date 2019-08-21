<template>
  <div class="p-3">
    <div class="flex flex-col h-full overflow-y-auto">
      <div class="text-center">
        <h1 class="my-3 text-3xl font-bold">
          Log In
        </h1>
      </div>
      <div v-show="errorMessage" class="error-box">
        <span>{{ errorMessage }}</span>
        <template v-if="unverified">
          <br>
          <span>
            Didn't receive verification email?
            <button class="btn btn-outline btn-outline-white" :class="{ 'btn-disabled': emailSent }" @click="sendVerificationEmail">
              {{ emailSent ? 'Email sent' : 'Send again' }}
            </button>
          </span>
        </template>
      </div>
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
      errorMessage: '',
      unverified: false,
      emailSent: false
    }
  },
  methods: {
    ...mapActions('auth', [
      'login',
      'sendVerify'
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
            this.unverified = (e.name === 'auth-unverified')
          })
      }
    },
    async sendVerificationEmail () {
      if (this.$refs.form.checkValidity()) {
        this.emailSent = true
        await this.sendVerify({ email: this.email })
          .then((data) => {
            this.errorMessage = 'Preview email at ' + data.preview
          })
          .catch((e) => {
            this.errorMessage = e.message
            this.emailSent = false
          })
      }
    }
  }
}
</script>

<style>

</style>
