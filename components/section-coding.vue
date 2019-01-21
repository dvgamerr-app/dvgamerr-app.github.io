<template>
<section class="coding-section pt-3 pb-2 d-print-none">
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
              <div class="item-stats-value">5 year</div>
              <div class="item-stats-name">Experience</div>
            </div>
          </div>
          <div class="col-sm-3">
            <div class="item-stats">
              <div class="item-stats-value">3.6K</div>
              <div class="item-stats-name">contributions</div>
            </div>
          </div>
          <div class="col-sm-3">
            <div class="item-stats">
              <div class="item-stats-value">98</div>
              <div class="item-stats-name">My Projects</div>
            </div>
          </div>
          <div class="col-sm-3">
            <div class="item-stats">
              <div class="item-stats-value">13</div>
              <div class="item-stats-name">Opensouce Projects</div>
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