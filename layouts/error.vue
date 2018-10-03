<template>
  <div style="text-align:center;">
    <h1 class="title">
      {{ error.statusCode }}
    </h1>
    <h2 class="info">
      {{ error.message }}
    </h2>
    <nuxt-link class="button" to="/" v-if="error.statusCode === 404">
      Homepage
    </nuxt-link>
  </div>
</template>
<script>
export default {
  props: ['error']
}
</script>