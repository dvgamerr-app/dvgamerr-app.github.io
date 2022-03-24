<template>
  <div>
    <section-header />
    <div>
      <section-contact/>
      <section-coding />
      <section-coding-history />
      <section-expertise />
      <section-skill />
      <section-education class="d-none print-only" />
    </div>
    <p class="pagebreak" />
    <section v-for="(e, i) in work" :key="i" :class="e.pagebreak ? 'pagebreak' : 'section-wrapper section-work pt-3 pb-3'">
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
                  <div class="markdown pt-1" v-html="$md.render('')" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <p class="pagebreak" />
    <div>
      <section-education class="d-print-none" :education="education" />
      <section-certificate class="d-print-none" :certificate="certificate" />
      <!-- <section-portfolio class="d-print-none" :portfolio="portfolio" /> -->
    </div>
    <page-footer />
  </div>
</template>
<script>
import dayjs from 'dayjs'
import data from '../static/data.json'

const { work } = data['en']

export default {
  data: () => ({ work }),
  computed: {
    allowEditor () {
      return this.$route.params && (this.$route.params.admin || '').indexOf('editor') === 0
    }
  },
  methods: {
    toDateRange (range) {
      const begin = dayjs(range.begin)
      const end = range.end ? dayjs(range.end) : dayjs()
      const diff = end.diff(begin, 'year', true)
      const month = parseInt((diff - parseInt(diff)) * 12)
      const year = parseInt(diff)
      return `${begin.format('MMMM YYYY')} - ${range.end ? end.format('MMMM YYYY') : 'Present'} (${year > 0 ? `${year} year` : ''}${month > 0 ? ` ${month} month` : ''})`
    }
  }
}
</script>
