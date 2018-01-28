<template>
<section id="about">
  <div class="container">
    <div class="row">
      <div class="col-md-24 col-sm-36">
        <div class="about-docs">
          <div class="wow fadeInUp section-title">
          <h2 v-html="$store.state.resume.about.title"></h2>
            <p v-html="$store.state.resume.about.job"></p>
          </div>
          <div>
            <p v-html="$store.state.resume.about.detail"></p>
          </div>
          <ul class="social-icon">
            <li v-for="item in $store.state.resume.about.social">
              <a :href="item.link" target="_blank" :class="['fa', item.icon]"></a>
            </li>
          </ul>
        </div>
        <adsbygoogle ad-slot="5645677887" ad-format="auto" :ad-style="{ display: 'block' }" />
      </div>

      <div class="col-md-12 col-sm-36">
        <div class="about-thumb">
          <h2 v-html="$store.state.resume.about.hobby.title"></h2>
          <div class="row justify-content-center">
            <a v-for="(item, index) in $store.state.resume.about.hobby.items" :id="`img-about-${index}`" :title="item.alt" target="_blank" :href="item.link">
              <img :src="item.image" class="img-fluid" :alt="item.alt">
              <b-tooltip :target="`img-about-${index}`" :placement="item.placement">{{item.alt}}</b-tooltip>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
</template>

<style lang="scss">

  #about {
    .section-title {
      padding-bottom: 16px;
    }

    .col-md-4 a {
      width: 100px;
      height: 100px;
      display: inline-block;
      margin: 6px 6px 0px 0;
    }

    .about-thumb {
      margin-top: 22px;
      a {
        text-align: center;
        padding: 7px;
      }
    }

    .about-docs {
      margin-top: 22px;
      strong {
        font-weight: normal;
        display: block;
        padding-top: 4px;
      }
    }
  }

</style>