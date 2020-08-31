<template>
  <section v-if="work.length > 0" class="section-wrapper section-work pt-3 pb-3">
    <div class="container">
      <div class="row">
        <div class="col-md-3">
          <div class="section-title">
            <h2>Work Experience</h2>
          </div>
        </div>
        <div class="col-md-9">
          <div class="row">
            <div v-for="e in work" :key="work.indexOf(e)" class="col-md-12">
              <div class="content-item">
                <small v-text="toDateRange(e.range)" />
                <h3 v-text="e.job" />
                <h4 v-text="e.work" />
                <div class="markdown pt-1" v-html="markedown(e.description)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import marked from 'marked'
import moment from 'moment'

export default {
  props: {
    editor: { type: Boolean },
    work: { type: Array, default: () => ([]) }
  },
  methods: {
    markedown (text) {
      return marked(text)
    },
    toDateRange (range) {
      const begin = moment(range.begin)
      const end = range.end ? moment(range.end) : moment()
      const diff = end.diff(begin, 'year', true)
      const month = parseInt((diff - parseInt(diff)) * 12)
      const year = parseInt(diff)
      return `${begin.format('MMMM YYYY')} - ${range.end ? end.format('MMMM YYYY') : 'Present'} (${year > 0 ? `${year} year` : ''}${month > 0 ? ` ${month} month` : ''})`
    }
  }
}
</script>
