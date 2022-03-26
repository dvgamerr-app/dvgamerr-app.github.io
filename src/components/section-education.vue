<template>
  <section class="section-wrapper section-education">
    <div class="container">
      <div class="row">
        <div class="col-md-3">
          <div class="section-title">
            <h2>Education</h2>
          </div>
        </div>
        <div class="col-md-9">
          <div class="row">
            <div v-for="(e, i) in education" :key="i" class="col-md-6">
              <div class="content-item">
                <small v-text="e.range" />
                <h3 v-text="e.major" />
                <h4 v-text="e.location" />
                <p v-text="e.branch" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import data from '~/../docs/data/resume.json'

const { education } = data['en']

export default {
  data: () => ({ education })
}
</script>
