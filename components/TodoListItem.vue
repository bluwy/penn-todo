<template>
  <li class="flex flex-sm mb-2">
    <div class="flex items-center">
      <v-checkbox v-model="todoDone" />
    </div>
    <div class="flex-grow flex items-center">
      <span class="text-lg">{{ title }}</span>
    </div>
    <button
      class="btn btn-text btn-icon"
      @click="removeTodo(index)"
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
    title: {
      type: String,
      required: true
    },
    done: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      todoDone: false
    }
  },
  watch: {
    done (val) {
      this.todoDone = this.done
    },
    todoDone (val) {
      this.setTodoDone({
        index: this.index,
        val
      })
    }
  },
  mounted () {
    this.todoDone = this.done
  },
  methods: {
    ...mapActions([
      'removeTodo',
      'setTodoDone'
    ])
  }
}
</script>

<style>

</style>
