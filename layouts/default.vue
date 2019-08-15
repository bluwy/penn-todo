<template>
  <div class="bg-image flex justify-center items-center h-screen">
    <div class="card md:rounded-lg md:shadow-lg">
      <main class="flex-1 overflow-hidden">
        <nuxt class="h-full" />
      </main>
    </div>
  </div>
</template>

<script>
export default {

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

.error-box {
  @apply p-3 my-3 text-white bg-red-500 rounded text-center;
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
  @apply text-gray-600;
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
