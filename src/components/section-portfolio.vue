<template>
  <section v-if="portfolio.length > 0" class="section-wrapper section-portfolio d-print-none">
    <div class="container">
      <div class="row">
        <div class="col-md-3">
          <div class="section-title">
            <h2>Portfolio</h2>
          </div>
        </div>

        <div class="col-md-9">
          <div class="row">
            <div v-for="(e, i) in portfolio" :key="i" class="col-md-4 col-sm-6">
              <a class="portfolio-item" :href="e.url">
                <div class="portfolio-thumb"><img :src="`work/${e.thumb}`" loading="lazy" alt=""></div>
                <div class="portfolio-info">
                  <h3 v-text="e.title" />
                  <small v-text="e.subtitle" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { portfolio } from '~/../docs/data/resume.json'

export default {
  data: () => ({ portfolio })
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
