<template>
  <div class="p-3">
    <div class="flex flex-col h-full overflow-y-auto">
      <div class="text-center">
        <h1 class="my-3 text-3xl font-bold">
          Sign Up
        </h1>
      </div>
      <v-infobox class="my-3" :text="infoText" :type="infoType" auto-empty-hide />
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
          <span v-show="signupLoading" class="loading-ring" />
          <button class="btn btn-outline" type="submit">
            Sign up
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
import VInfobox from '~/components/VInfobox.vue'

export default {
  components: {
    VInfobox
  },
  data () {
    return {
      name: '',
      email: '',
      password: '',
      infoText: '',
      infoType: '',
      signupLoading: false,
      signupDone: false
    }
  },
  methods: {
    ...mapActions('auth', [
      'signup',
      'sendVerify'
    ]),
    ...mapActions('snackbar', [
      'sendSnack'
    ]),
    async submit () {
      if (!this.signupDone && this.$refs.form.checkValidity()) {
        this.signupDone = true
        this.signupLoading = true
        await this.signup({
          name: this.name,
          email: this.email,
          password: this.password
        })
          .then(async () => {
            this.sendSnack({
              text: 'Sign up successful',
              type: 'success'
            })
            const { preview = '' } = await this.sendVerify({ email: this.email }) || {}
            this.$router.push({
              name: 'login',
              params: {
                email: this.email,
                password: this.password,
                extraInfo: 'Verification email has been sent. Please verify before logging in. Preview at ' + preview
              }
            })
          })
          .catch((e) => {
            this.signupDone = false
            this.infoText = e.message
            this.infoType = 'error'
          })
          .finally(() => {
            this.signupLoading = false
          })
      }
    }
  }
}
</script>

<style>

</style>
