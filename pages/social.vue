<template>
  <div class="container">
    <div class="panel row">
      <div class="col-6 text-center">
        <h1>Social media.</h1>
      </div>
      <div class="col-6 text-center">
        <h1>Social media.</h1>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  layout: 'social',
  data: () => ({
    error: true
  }),
  head () {
    return {
      title: 'Social - Kananek T.'
    }
  },
  async created () {
  }
}
</script>
<style lang="scss">
#__nuxt, #__layout, .container {
  height: 100vh;
}
.panel {
  block-size: 100%;
  box-sizing: border-box;
  margin: 0;

  .grid-center {
    min-block-size: 100%;
    font-family: system-ui, sans-serif;

    display: grid;
    place-content: center;
  }
}
</style>
