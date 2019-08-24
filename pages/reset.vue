<template>
  <div class="p-3">
    <div class="flex flex-col h-full overflow-y-auto">
      <h1 class="my-3 text-3xl font-bold text-center">
        Reset Password
      </h1>
      <span class="my-3 text-center">Almost there! Enter your new password and voila~</span>
      <v-infobox class="my-3" :text="infoText" :type="infoType" auto-empty-hide />
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
import VInfobox from '~/components/VInfobox.vue'

export default {
  components: {
    VInfobox
  },
  middleware ({ query, redirect }) {
    if (!query.token) {
      redirect('/forgot')
    }
  },
  data () {
    return {
      password: '',
      infoText: '',
      infoType: '',
      resetDone: false
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
      if (!this.resetDone && this.$refs.form.checkValidity()) {
        this.resetDone = true
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
            this.resetDone = false
            this.infoText = e.message
            this.infoType = 'error'
          })
      }
    }
  }
}
</script>

<style>

</style>
