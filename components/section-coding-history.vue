<template>
<section v-if="!!coding" class="coding-history-section pt-2 pb-5 d-print-none">
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <div class="section-title">
          <h2>Code History</h2>
        </div>
      </div>
      <div class="col-md-9">
        <div class="row">
          <div class="col-sm-3">
            <div class="item-stats">
              <div class="item-stats-value" v-text="parseTime(coding.yesterday_seconds)"></div>
              <div class="item-stats-name">Yesterday Coding</div>
            </div>
          </div>
          <div class="col-sm-3">
            <div class="item-stats">
              <div class="item-stats-value" v-text="parseTime(coding.average_seconds)"></div>
              <div class="item-stats-name">Daily Average</div>
            </div>
          </div>
          <div class="col-sm-3">
            <div class="item-stats">
              <div class="item-stats-value" v-text="parseTime(coding.best_seconds)"></div>
              <div class="item-stats-name">Best Coding</div>
            </div>
          </div>
          <div class="col-sm-3">
            <div class="item-stats">
              <div class="item-stats-value" v-text="coding.languages"></div>
              <div class="item-stats-name">languages</div>
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
    coding: { type: Object }
  },
  methods: {
    parseTime (seconds = 0) {
      return `${seconds > 60 * 60 ? `${parseInt(seconds / 60 / 60)}h ` : ''}${parseInt(seconds / 60 % 60)}m`
    }
  }
}
</script>
<style scoped>
.item-stats .item-stats-value{
  font-size: 18px;
  color: #444;
  font-weight: 500;
}

.item-stats .item-stats-name{
  font-size: 12px;
  text-transform: uppercase;
  line-height: 1;
}


@media (max-width: 768px) {
  .item-stats{
    margin-bottom: 30px;
  }
}
</style>