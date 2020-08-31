<template>
  <footer class="footer d-print-none">
    <div class="copyright-section">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <div class="copytext">
              Copyright <fa :icon="['far', 'copyright']" /> {{ getYear }} {{ orgs }},  <br class="d-block d-sm-none"> all rights reserved ∙
              Design By <a :href="url" target="_blank" v-text="name" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  data () {
    return {
      orgs: 'Touno™',
      url: 'https://mr.touno.io',
      name: 'Kananek T.',
      getYear: (new Date()).getFullYear()
    }
  }
}
</script>
