<template>
  <section v-if="education.length > 0" class="section-wrapper section-education">
    <div class="container">
      <div class="row">
        <div class="col-md-3">
          <div class="section-title">
            <h2>Education</h2>
          </div>
        </div>

        <div class="col-md-9">
          <div class="row">
            <div v-for="e in education" :key="education.indexOf(e)" class="col-md-6">
              <div class="content-item">
                <small v-text="e.range" />
                <h3 v-text="e.major" />
                <h4 v-text="e.location">
                  University of California
                </h4>
                <p v-text="e.branch">
                  United Kingdom, London
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  props: {
    editor: { type: Boolean },
    education: { type: Array, default: () => ([]) }
  }
}
</script>
