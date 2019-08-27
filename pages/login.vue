<template>
  <div class="p-3">
    <div class="flex flex-col h-full overflow-y-auto">
      <div class="text-center">
        <h1 class="my-3 text-3xl font-bold">
          Log In
        </h1>
      </div>
      <span v-if="extraInfo" class="my-3 text-center">{{ extraInfo }}</span>
      <v-infobox
        class="my-3"
        :text="infoText"
        :type="infoType"
        auto-empty-hide
      >
        <div v-show="unverified">
          Didn't receive verification email?
          <span v-show="loadingShow" class="loading-ring" />
          <button
            class="btn btn-outline btn-outline-white"
            :class="{ 'btn-disabled': emailSent }"
            :disabled="emailSent"
            @click="sendVerificationEmail"
          >
            Send again
          </button>
        </div>
      </v-infobox>
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
            Log in
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
import VInfobox from '~/components/VInfobox.vue'

export default {
  meta: {
    avoidIfAuth: true
  },
  components: {
    VInfobox
  },
  data () {
    return {
      email: '',
      password: '',
      extraInfo: '',
      infoText: '',
      infoType: '',
      unverified: false,
      emailSent: false,
      loadingShow: false,
      loginDone: false
    }
  },
  mounted () {
    this.email = this.$route.params.email
    this.password = this.$route.params.password
    this.extraInfo = this.$route.params.extraInfo
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
      if (!this.loginDone && this.$refs.form.checkValidity()) {
        this.loginDone = true
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
            this.loginDone = false
            this.infoText = e.message
            this.infoType = 'error'
            this.unverified = (e.name === 'auth-unverified')
          })
      }
    },
    async sendVerificationEmail () {
      if (!this.emailSent && this.$refs.form.checkValidity()) {
        this.emailSent = true
        this.loadingShow = true
        await this.sendVerify({ email: this.email })
          .then((data) => {
            this.infoText = 'Preview email at ' + data.preview
            this.infoType = 'info'
            this.sendSnack({
              text: 'Email sent',
              type: 'success'
            })
          })
          .catch((e) => {
            this.emailSent = false
            this.infoText = e.message
            this.infoType = 'error'
          })
          .finally(() => {
            this.loadingShow = false
          })
      }
    }
  }
}
</script>

<style>

</style>
