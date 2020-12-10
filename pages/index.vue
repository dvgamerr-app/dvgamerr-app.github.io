<template>
  <div id="main-wrapper">
    <div v-if="fullname">
      <section-header :editor="allowEditor" :resume="{ fullname, birthday, national, language, job, detail, social, salary, interview, location }" />
      <section-coding :editor="allowEditor" :coding="coding" />
      <section-coding-history :editor="allowEditor" :coding="coding" />
      <section-expertise :editor="allowEditor" :expertise="expertise" />
      <section-skill :editor="allowEditor" :skill="skill" />
      <p class="pagebreak" />
      <section-work :editor="allowEditor" :work="work" />
      <p class="pagebreak" />
      <section-education :editor="allowEditor" :education="education" />
      <section-certificate :editor="allowEditor" :certificate="certificate" />
      <section-portfolio :editor="allowEditor" :portfolio="portfolio" />
      <section-contact v-if="grecaptcha" :editor="allowEditor" :contact="contact" :grecaptcha="grecaptcha" />
    </div>
    <page-footer :editor="allowEditor" />
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
import sectionPortfolio from '~/components/section-portfolio.vue'
import sectionCertificate from '~/components/section-certificate.vue'
import sectionContact from '~/components/section-contact.vue'
import pageFooter from '~/components/page-footer.vue'

export default {
  components: {
    sectionHeader,
    sectionCoding,
    sectionCodingHistory,
    sectionExpertise,
    sectionSkill,
    sectionWork,
    sectionEducation,
    sectionPortfolio,
    sectionCertificate,
    sectionContact,
    pageFooter
  },
  async asyncData ({ $axios }) {
    try {
      const { data } = await $axios.get('/resume')
      return data
    } catch (ex) {
      return {
        error: true
      }
    }
  },
  data: () => ({
    error: false,
    fullname: {},
    birthday: {},
    national: {},
    language: {},
    job: {},
    detail: {},
    social: {},
    salary: {},
    interview: {},
    location: {},
    coding: {},
    expertise: [],
    skill: {},
    work: [],
    education: [],
    certificate: [],
    portfolio: [],
    contact: [],
    grecaptcha: ''
  }),
  computed: {
    allowEditor () {
      return this.$route.params && (this.$route.params.admin || '').indexOf('editor') === 0
    }
  },
  created () {
    if (!process.client) { return }
    const raw = localStorage.getItem('resume')
    if (!raw) { return }

    if (this.error) {
      this.$data = JSON.parse(raw)
    } else {
      localStorage.setItem('resume', JSON.stringify(this.$data))
    }
  }
}
</script>
