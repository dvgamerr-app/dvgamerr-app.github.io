<template>
<section id="home">
  <div class="container">
    <div class="row">
      <div class="col-md-9 md-offset-3 col-sm-12">
        <img src="~assets/icon.jpg" class="img-fluid rounded-circle" alt="Kananek Thongkam">
      </div>
      <div class="col-md-24 col-sm-24">
        <h1 v-html="$t('home.title')"></h1>
        <a :href="$store.state.resume.file" target="_blank" class="btn btn-default section-btn" v-text="$store.state.resume.button"></a>
        <button @click="() => setLanguage('en')">EN</button><button @click="() => setLanguage('th')">TH</button>
      </div>
    </div>
  </div>
</section>
</template>
<script>
export default {
  methods: {
    setLanguage (lang) {
      this.$ls.set('locale', lang)
    }
  }
}
</script>
