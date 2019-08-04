<template>
  <li class="flex flex-sm mb-2">
    <div class="flex items-center">
      <v-checkbox :value="done" @input="setTodoDoneMethod" />
    </div>
    <div class="flex-grow flex items-center">
      <span class="text-lg">{{ title }}</span>
    </div>
    <button
      class="btn btn-text btn-icon"
      @click="removeTodo({ uid })"
    >
      <i class="icon-cancel" />
    </button>
  </li>
</template>

<script>
import { mapActions } from 'vuex'
import VCheckbox from '~/components/VCheckbox.vue'

export default {
  components: {
    VCheckbox
  },
  props: {
    uid: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    done: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    ...mapActions([
      'removeTodo',
      'setTodoDone'
    ]),
    setTodoDoneMethod (done) {
      // This will dispatch done and update the prop's done
      this.setTodoDone({
        uid: this.uid,
        done
      })
    }
  }
}
</script>

<style>

</style>
