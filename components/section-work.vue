<template>
<section class="section-wrapper pt-3 pb-3" v-if="work.length > 0">
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <div class="section-title"><h2>Work Experience</h2></div>
      </div>
      <div class="col-md-9">
        <div class="row">
          <div class="col-md-12" v-for="e in work" :key="work.indexOf(e)">
            <div class="content-item">
              <small v-text="e.range">April 2011 - April 2013</small>
              <h3 v-text="e.job">Freelance — Programmer</h3>
              <h4 v-text="e.work">Phetchaburi</h4>
              <div class="markdown-body" v-html="markedown(e.description)"></div>
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

export default {
  props: {
    work: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    markedown (text) {
      return marked(text)
    }
  }
}
</script>
