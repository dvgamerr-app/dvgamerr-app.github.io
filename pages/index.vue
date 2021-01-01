<template>
  <div>
    <client-only>
      <section-header :editor="allowEditor" :resume="{ error, fullname, birthday, national, language, job, detail, social, salary, interview, location }" />
      <div v-if="!error">
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
    </client-only>
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
  data: () => ({
    error: true,
    fullname: 'Kananek Thongkam',
    job: 'Full Stack Engineer',
    birthday: {},
    national: {},
    language: {},
    detail: 'Loading...',
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
  async mounted () {
    const raw = window.localStorage.getItem('resume')
    if (raw) {
      await this.updateData(JSON.parse(raw))
    }

    try {
      const { data } = await this.$axios.get('/resume')
      if (!raw) { await this.updateData(data) }
      window.localStorage.setItem('resume', JSON.stringify(data))
    } catch {
      const { data } = await this.$axios.get('https://mr.touno.io/data.json')
      await this.updateData(data)
    }
  },
  async created () {
  },
  methods: {
    updateData (data = {}) {
      this.error = false
      this.fullname = data.fullname
      this.job = data.job
      this.birthday = data.birthday
      this.national = data.national
      this.language = data.language
      this.detail = data.detail
      this.social = data.social
      this.salary = data.salary
      this.interview = data.interview
      this.location = data.location
      this.coding = data.coding
      this.expertise = data.expertise
      this.skill = data.skill
      this.work = data.work
      this.education = data.education
      this.certificate = data.certificate
      this.portfolio = data.portfolio
      this.contact = data.contact
      this.grecaptcha = data.grecaptcha
    }
  }
}
</script>
