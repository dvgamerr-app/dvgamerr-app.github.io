<template>
<section class="expertise-wrapper pt-3 pb-3" v-if="expertise.length > 0">
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <div class="section-title">
          <h2>My Specialities</h2>
        </div>
      </div>
      <div class="col-md-9">
        <div class="row">
          <div class="col-md-6" v-for="e in expertise" :key="expertise.indexOf(e)">
            <div class="expertise-item">
              <h3 v-text="e.subject"></h3>
              <p v-html="e.detail"></p>
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
    expertise: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>

<style scoped>
.expertise-item {
  margin-bottom : 20px;
}

.expertise-item h3 {
  text-transform : uppercase;
  margin-bottom  : 5px;
}
</style>