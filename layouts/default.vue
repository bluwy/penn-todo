<template>
  <div class="bg-image h-screen">
    <div class="h-screen flex justify-center items-center">
      <div class="card md:rounded-lg md:shadow-lg">
        <the-header />
        <main class="flex-1 flex overflow-hidden">
          <nuxt class="flex-1" />
        </main>
        <the-footer />
      </div>
    </div>
  </div>
</template>

<script>
import TheHeader from '~/components/TheHeader.vue'
import TheFooter from '~/components/TheFooter.vue'

export default {
  components: {
    TheHeader,
    TheFooter
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
}

*, *:before, *:after {
  box-sizing: border-box;
}

a {
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
    width: 500px;
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

.btn-icon {
  @apply px-2;
}

.btn-text {
  @apply text-gray-500;
}
.btn-text:hover {
  @apply bg-purple-500 text-white;
}

.flex-sm {
  @apply -mx-1;
}
.flex-sm > * {
  @apply mx-1;
}
</style>
