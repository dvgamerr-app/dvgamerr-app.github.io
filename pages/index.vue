<template>
<div id="main-wrapper">
  <section-header/>
</div>
</template>

<script>
import sectionHeader from '~/components/section-header.vue'

export default {
  components: {
    sectionHeader
    // about,
    // skill,
    // work
  },
  dataAsync () {
    return {
    }
  }
}
</script>

<style>

</style>