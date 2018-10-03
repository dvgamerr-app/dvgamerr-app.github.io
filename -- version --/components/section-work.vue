<template>
<section id="work">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-36 col-sm-36">
        <div class="section-title">
          <h2 v-text="$store.state.resume.work.title"></h2>
          <p v-html="$store.state.resume.work.detail"></p>
        </div>
      </div>
      <div v-for="item in $store.state.resume.work.items" class="col-md-9 col-sm-18">
        <div class="work-thumb">
          <a :href="item.thumb" class="image-popup"><img :src="item.image" class="img-fluid" :alt="item.title"></a>
        </div>
        <h4 v-text="item.name"></h4>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-36">
        <adsbygoogle ad-slot="8273331915" ad-format="auto" :ad-style="{ display: 'block' }" />
      </div>
    </div>
    <div class="row">
      <div class="col-sm-36" style="margin-top: 60px; text-align:right;" v-html="$store.state.resume.footer"></div>
    </div>
  </div>
</section>
</template>