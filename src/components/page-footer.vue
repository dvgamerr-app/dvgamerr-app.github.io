<template>
  <footer class="container  d-print-none">
    <div class="footer copyright-section">
      <div class="row">
        <div class="col-36">
          <div class="copytext">
            &copy; {{ getYear }} <b>TOUNO.io</b> design by
            <a href="https://mr.touno.io/" target="_blank">Kananek T.</a> and
            <a href="https://webring.wonderful.software#mr.touno.io">
              webring <img alt="webring" src="~assets/webring.svg" width="14" height="14" style="margin-bottom: 3px">
            </a> v{{ version }}
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
    getYear: (new Date()).getFullYear()
  })
}
</script>

<style lang="scss" scoped>
.footer {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: .8rem;

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
