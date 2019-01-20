<template>
<div id="main-wrapper">
  <section-header :resume="{ fullname, birthday, national, language, job, detail, social }" />
  <section-coding/>
  <section-coding-history/>
  <section-expertise :expertise="expertise"/>
  <section-skill :skill="skill"/>
  <section-work :work="work"/>
  <section-education :education="education"/>
</div>
</template>
<script>
import sectionHeader from '~/components/section-header.vue'
import sectionCoding from '~/components/section-coding.vue'
import sectionCodingHistory from '~/components/section-coding-history.vue'
import sectionExpertise from '~/components/section-expertise.vue'
import sectionSkill from '~/components/section-skill.vue'
import sectionWork from '~/components/section-work.vue'
import sectionEducation from '~/components/section-education.vue'

const axios = require('axios')

export default {
  components: {
    sectionHeader,
    sectionCoding,
    sectionCodingHistory,
    sectionExpertise,
    sectionSkill,
    sectionWork,
    sectionEducation
  },
  async asyncData () {
    const { data } = await axios.get('/my-resume')
    if (!data) throw new Error('Profile not found.')
    return data
  }
}
</script>

<style>

</style>