<template>
  <div class="p-3">
    <div class="flex flex-col h-full overflow-y-auto">
      <h1 class="my-3 text-3xl font-bold text-center">
        Forgot Password
      </h1>
      <span class="my-3 text-center">Enter your email below to send a "reset password" email</span>
      <v-infobox class="my-3" :text="infoText" :type="infoType" auto-empty-hide />
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
          <span v-show="loadingShow" class="loading-ring" />
          <button
            class="btn btn-outline"
            :class="{ 'btn-disabled': emailSent }"
            type="submit"
            :disabled="emailSent"
          >
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
import { mapActions } from 'vuex'
import VInfobox from '~/components/VInfobox.vue'

export default {
  components: {
    VInfobox
  },
  data () {
    return {
      email: '',
      infoText: '',
      infoType: '',
      emailSent: false,
      loadingShow: false
    }
  },
  methods: {
    ...mapActions('auth', [
      'forgot'
    ]),
    ...mapActions('snackbar', [
      'sendSnack'
    ]),
    async submit () {
      if (!this.emailSent && this.$refs.form.checkValidity()) {
        this.emailSent = true
        this.loadingShow = true
        await this.forgot({ email: this.email })
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
