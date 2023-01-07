<template>
  <section class="section-wrapper section-coding d-print-none">
    <div class="row">
      <div class="col-lg-9 col-md-11">
        <div class="section-title">
          <h2>Code History</h2>
        </div>
      </div>
      <div class="col-lg-27 col-md-25 col-sm-36 d-grid stats">
        <div class="stats-item">
          <div class="value" v-text="parseTime(coding.weekly_seconds)" />
          <div class="name">
            Weekly Coding
          </div>
        </div>
        <div class="stats-item">
          <div class="value" v-text="parseTime(coding.average_seconds)" />
          <div class="name">
            Daily Average
          </div>
        </div>
        <div class="stats-item">
          <div class="value" v-text="parseTime(coding.best_seconds)" />
          <div class="name">
            Best Coding
          </div>
        </div>
        <div class="stats-item">
          <div class="value" v-text="coding.languages" />
          <div class="name">
            languages
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import coding from '~/../docs/data/coding.json'

export default {
  data: () => ({ coding }),
  methods: {
    parseTime (seconds = 0) {
      return `${seconds > 60 * 60 ? `${parseInt(seconds / 60 / 60)}h ` : ''}${parseInt(seconds / 60 % 60)}m`
    }
  }
}
</script>
<style lang="scss">

.charts-css.column {
  height: 240px;
  max-width: 95%;
  margin: 0 auto;
}
.charts-css.column > tbody td {
  --color: var(--color-7);
}

</style>
