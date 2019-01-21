<template>
<div id="main-wrapper">
  <section-header :editor="allowEditor" :resume="{ fullname, birthday, national, language, job, detail, social, salary, interview, location }" />
  <section-coding :editor="allowEditor"/>
  <section-coding-history :editor="allowEditor"/>
  <section-expertise :editor="allowEditor" :expertise="expertise"/>
  <section-skill :editor="allowEditor" :skill="skill"/>
  <section-work :editor="allowEditor" :work="work"/>
  <section-education :editor="allowEditor" :education="education"/>
  <section-contact :editor="allowEditor" :contact="contact" :grecaptcha="grecaptcha"/>
  <page-footer :editor="allowEditor"/>
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
import sectionContact from '~/components/section-contact.vue'
import pageFooter from '~/components/page-footer.vue'

const axios = require('axios')

export default {
  components: {
    sectionHeader,
    sectionCoding,
    sectionCodingHistory,
    sectionExpertise,
    sectionSkill,
    sectionWork,
    sectionEducation,
    sectionContact,
    pageFooter
  },
  computed: {
    allowEditor () {
      return this.$route.params && (this.$route.params.admin || '').indexOf('editor-') > -1
    }
  },
  async asyncData () {
    const { data } = await axios.get('/my-resume')
    if (!data) throw new Error('Profile not found.')
    return data
  }
}
</script>
