<template>
<section v-if="!!coding"  class="coding-section pt-3 pb-2 d-print-none">
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <div class="section-title">
          <h2>My Coding</h2>
        </div>
      </div>
      <div class="col-md-9">
        <div class="row">
          <div class="col-sm-3">
            <div class="item-stats">
              <div class="item-stats-value" v-text="getExperience"></div>
              <div class="item-stats-name">Experience</div>
            </div>
          </div>
          <div class="col-sm-3">
            <div class="item-stats">
              <div class="item-stats-value" v-text="toNumber(coding.contributions)"></div>
              <div class="item-stats-name">contributions</div>
            </div>
          </div>
          <div class="col-sm-3">
            <div class="item-stats">
              <div class="item-stats-value" v-text="toNumber(coding.project)"></div>
              <div class="item-stats-name">My Projects</div>
            </div>
          </div>
          <div class="col-sm-3">
            <div class="item-stats">
              <div class="item-stats-value" v-text="toNumber(coding.opensource)"></div>
              <div class="item-stats-name">Opensource Projects</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
</template>
<script>
import moment from 'moment'

export default {
  props: {
    editor: { type: Boolean },
    coding: { type: Object }
  },
  methods: {
    toNumber (n = 0) {
      return n / 1000 >= 1 ? `${parseInt(n / 1000 * 10) / 10}K` : n
    }
  },
  computed: {
    getExperience () {
      return moment(this.coding.experience).fromNow(true)
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