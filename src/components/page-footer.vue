<template>
  <footer class="container  d-print-none">
    <div class="footer copyright-section">
      <div class="row">
        <div class="col-36">
          <div class="copytext">
            Copyright <font-awesome-icon :icon="['far', 'copyright']" /> {{ getYear }} {{ orgs }},  <br class="d-block d-sm-none"> v{{ version }} ∙
            Design By <a :href="url" target="_blank" v-text="myName" /> and
            <a href="https://webring.wonderful.software#mr.touno.io" title="วงแหวนเว็บ">
              webring <img alt="webring" src="~assets/webring.svg" width="14" height="14" style="margin-bottom: 3px">
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
const { version } = require('../../package.json')

export default {
  data: () => ({
    version,
    orgs: 'Touno™',
    url: 'https://mr.touno.io',
    myName: 'Kananek T.',
    getYear: (new Date()).getFullYear()
  })
}
</script>

<style lang="scss" scoped>
.footer {
  padding-top: 3em;
  text-align: right;

  &.copyright-section {
    font-size: .8rem;

    .copytext {
      font-weight: 400;
      display: block;
    }
  }
}
</style>
