<template>
  <section v-if="expertise.length > 0" class="section-wrapper section-expertise">
    <div class="container">
      <div class="row">
        <div class="col-lg-9 col-md-11">
          <div class="section-title">
            <h2>My Specialities</h2>
          </div>
        </div>
        <div class="col-lg-27 col-md-25 col-sm-36">
          <div class="row">
            <div v-for="e in expertise" :key="expertise.indexOf(e)" class="col-md-18">
              <div class="expertise-item">
                <h3 v-text="e.subject" />
                <p v-html="$md.render(e.detail)" />
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

const { expertise } = data['en']

export default {
  data: () => ({ expertise })
}
</script>

<style >
.expertise-item {
  margin-bottom : 20px;
}

.expertise-item h3 {
  text-transform : uppercase;
  margin-bottom  : 5px;
}

</style>
