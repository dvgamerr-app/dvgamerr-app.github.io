<template>
  <footer class="footer d-print-none">
    <div class="copyright-section">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <div class="copytext">
              Copyright <font-awesome-icon :icon="['far', 'copyright']" /> {{ getYear }} {{ orgs }},  <br class="d-block d-sm-none"> all rights reserved ∙
              Design By <a :href="url" target="_blank" v-text="name" />, and
              <a href="https://webring.wonderful.software#mr.touno.io" title="วงแหวนเว็บ">
                <img v-lazy-load data-src="~assets/webring.svg" width="14" height="14" style="margin-bottom: 3px">
              </a>
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
