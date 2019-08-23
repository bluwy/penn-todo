<template>
  <div class="bg-image flex justify-center items-center h-screen">
    <v-snackbar />
    <div class="card md:rounded-lg md:shadow-lg">
      <main class="flex-1 overflow-hidden">
        <nuxt class="h-full" />
      </main>
    </div>
  </div>
</template>

<script>
import VSnackbar from '~/components/VSnackbar.vue'

export default {
  components: {
    VSnackbar
  }
}
</script>

<style lang="postcss">
html {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
}

*, *:before, *:after {
  box-sizing: border-box;
}

a {
  @apply text-purple-600;
  font-weight: 500;
}
a:hover, a:focus {
  text-decoration: underline;
}

.bg-image {
  @apply bg-center bg-no-repeat bg-cover;
  background-image: url('~assets/images/wallpaper.jpg');
}

.card {
  @apply flex flex-col w-full h-full bg-gray-100 overflow-hidden;
}
@media (min-width: 768px) {
  .card {
    @apply max-w-xl;
    min-height: 60%;
    max-height: 80%;
  }
}

.text-box {
  @apply px-3 py-1 rounded border border-gray-500;
  transition: all .2s cubic-bezier(.4, 0, .2, 1);
}
.text-box:hover, .text-box:focus {
  @apply outline-none shadow-none border-purple-500;
}

.error-box {
  @apply p-3 my-3 text-white bg-red-400 rounded text-center;
}

.btn {
  @apply px-3 py-1 rounded font-semibold;
  transition: all .2s cubic-bezier(.4, 0, .2, 1);
}

.btn-outline {
  @apply border border-purple-500 text-purple-500;
}
.btn-outline:hover {
  @apply bg-purple-500 text-white;
}

.btn-outline-white {
  @apply border-white text-white;
}
.btn-outline-white:hover {
  @apply bg-white text-black;
}

.btn-icon {
  @apply px-2;
}

.btn-text {
  @apply text-gray-600;
}
.btn-text:hover {
  @apply bg-purple-500 text-white;
}

.btn-disabled, .btn-disabled:hover {
  @apply bg-gray-500 border-gray-500 text-black pointer-events-none;
}

.loading-ring {
  display: inline-block;
  vertical-align: middle;
  width: 1.2em;
  height: 1.2em;
}

.loading-ring::after {
  @apply border-purple-500;
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  border-width: 3px;
  border-top-color: transparent;
  border-bottom-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.flex-sm {
  @apply -mx-1;
}
.flex-sm > * {
  @apply mx-1;
}
</style>
