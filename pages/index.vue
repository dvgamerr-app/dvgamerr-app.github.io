<template>
  <div>
    <home/>
    <about/>
    <skill/>
    <work/>
  </div>
</template>

<script>
import home from '~/components/section-home.vue'
import about from '~/components/section-about.vue'
import skill from '~/components/section-skill.vue'
import work from '~/components/section-work.vue'

export default {
  components: {
    home,
    about,
    skill,
    work
  }
}
</script>
