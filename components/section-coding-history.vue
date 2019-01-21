<template>
<section class="coding-history-section pt-2 pb-5 d-print-none">
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
              <div class="item-stats-value">100%</div>
              <div class="item-stats-name">Jobs Success</div>
            </div>
          </div>
          <div class="col-sm-3">
            <div class="item-stats">
              <div class="item-stats-value">96%</div>
              <div class="item-stats-name">On Budget</div>
            </div>
          </div>
          <div class="col-sm-3">
            <div class="item-stats">
              <div class="item-stats-value">99%</div>
              <div class="item-stats-name">On Time</div>
            </div>
          </div>
          <div class="col-sm-3">
            <div class="item-stats">
              <div class="item-stats-value">89%</div>
              <div class="item-stats-name">Repeat Hire Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
</template>

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