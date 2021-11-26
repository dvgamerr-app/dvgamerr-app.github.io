<template>
  <div>
    <client-only>
      <section-header :editor="allowEditor" :resume="{ error, fullname, birthday, national, language, job, detail, social, salary, interview, location }" />
      <div v-if="!error">
        <section-contact :editor="allowEditor" :contact="contact" :grecaptcha="grecaptcha" />
        <section-coding :editor="allowEditor" :coding="coding" />
        <section-coding-history :editor="allowEditor" :coding="coding" />
        <section-expertise :editor="allowEditor" :expertise="expertise" />
        <section-skill :editor="allowEditor" :skill="skill" />
        <section-education class="d-none print-only" :editor="allowEditor" :education="education" />
      </div>
      <p class="pagebreak" />
      <section v-for="e in work" :key="work.indexOf(e)" :class="e.pagebreak ? 'pagebreak' : 'section-wrapper section-work pt-3 pb-3'">
        <div v-if="!e.pagebreak" class="container">
          <div class="row">
            <div class="col-md-3">
              <div class="section-title">
                <h2>Work Experience</h2>
              </div>
            </div>
            <div class="col-md-9">
              <div class="row">
                <div class="col-md-12">
                  <div class="content-item">
                    <small v-text="toDateRange(e.range)" />
                    <h3 v-text="e.job" />
                    <h4 v-text="e.work" />
                    <div class="markdown pt-1" v-html="$md.render(e.description)" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <p class="pagebreak" />
      <div v-if="!error">
        <section-education class="d-print-none" :editor="allowEditor" :education="education" />
        <section-certificate class="d-print-none" :editor="allowEditor" :certificate="certificate" />
        <section-portfolio class="d-print-none" :editor="allowEditor" :portfolio="portfolio" />
      </div>
      <page-footer :editor="allowEditor" />
    </client-only>
  </div>
</template>
<script>
import dayjs from 'dayjs'

import sectionHeader from '~/components/section-header.vue'
import sectionCoding from '~/components/section-coding.vue'
import sectionCodingHistory from '~/components/section-coding-history.vue'
import sectionExpertise from '~/components/section-expertise.vue'
import sectionSkill from '~/components/section-skill.vue'
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
    const { data } = await this.$axios.get(`${document.location.origin}/data.json`)
    return this.updateData(data)
  },
  methods: {
    toDateRange (range) {
      const begin = dayjs(range.begin)
      const end = range.end ? dayjs(range.end) : dayjs()
      const diff = end.diff(begin, 'year', true)
      const month = parseInt((diff - parseInt(diff)) * 12)
      const year = parseInt(diff)
      return `${begin.format('MMMM YYYY')} - ${range.end ? end.format('MMMM YYYY') : 'Present'} (${year > 0 ? `${year} year` : ''}${month > 0 ? ` ${month} month` : ''})`
    },
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
