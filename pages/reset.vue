<template>
  <div class="p-3">
    <div class="flex flex-col h-full overflow-y-auto">
      <h1 class="my-3 text-3xl font-bold text-center">
        Reset Password
      </h1>
      <span class="my-3 text-center">Almost there! Enter your new password and voila~</span>
      <span v-show="errorMessage" class="error-box">{{ errorMessage }}</span>
      <form ref="form" @submit.prevent="submit">
        <div>
          <label for="password">New password</label>
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
            Change
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
  middleware ({ query, redirect }) {
    if (!query.token) {
      redirect('/forgot')
    }
  },
  data () {
    return {
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    ...mapActions('auth', [
      'reset'
    ]),
    ...mapActions('snackbar', [
      'sendSnack'
    ]),
    async submit () {
      if (this.$refs.form.checkValidity()) {
        await this.reset({
          token: this.$route.query.token,
          password: this.password
        })
          .then(() => {
            this.sendSnack({
              text: 'Password resetted',
              type: 'success'
            })
            this.$router.push('/login')
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
