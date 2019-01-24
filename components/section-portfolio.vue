<template>
<section v-if="portfolio.length > 0" class="portfolio-section pt-3 pb-3">
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <div class="section-title">
          <h2>Portfolio</h2>
        </div>
      </div>

      <div class="col-md-9">
        <div class="row">
          <div class="col-md-4 col-sm-6" v-for="e in portfolio" :key="portfolio.indexOf(e)">
            <a class="portfolio-item" :href="e.url">
              <div class="portfolio-thumb"><img :src="`work/${e.thumb}`" alt=""></div>
              <div class="portfolio-info">
                <h3 v-text="e.title"></h3>
                <small v-text="e.subtitle"></small>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
    <!-- /.row -->
  </div>
</section>
</template>
<script>

export default {
  props: {
    editor: { type: Boolean },
    portfolio: { type: Array, default: () => ([]) }
  }
}
</script>
<style scoped>

.portfolio-item {
  position      : relative;
  display       : block;
  margin-bottom : 30px;
}

.portfolio-item .portfolio-thumb img {
  height    : auto;
  display   : block;
  max-width : 100%;
}

.portfolio-item .portfolio-info {
  position   : absolute;
  padding    : 15px 15px 5px;
  bottom     : 0;
  width      : 100%;
  z-index    : 1;
  background : -webkit-linear-gradient(
    top,
    transparent 0%,
    rgba(0, 0, 0, 0.2) 100%
  );
}

.portfolio-item::after {
  content    : "";
  position   : absolute;
  bottom     : 0;
  top        : 100%;
  left       : 0;
  right      : 0;
  background : -webkit-linear-gradient(
    top,
    transparent 0%,
    #666 100%
  );
  transition : all .2s linear;
}

.portfolio-item:hover::after {
  top : 0;
}

.portfolio-item .portfolio-info h3 {
  margin         : 0;
  line-height    : 1;
  color          : #ffffff;
  font-weight    : 500;
  text-transform : uppercase;
}

.portfolio-item .portfolio-info small {
  color : rgba(255, 255, 255, .3);
}
</style>
