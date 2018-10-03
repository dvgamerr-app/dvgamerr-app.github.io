<template>
<div>
    <home/>
</div>
</template>

<script>
import home from '~/components/section-home.vue'

export default {
  components: {
    home
    // about,
    // skill,
    // work
  },
  dataAsync () {
    return {
    }
  },
  head () {
    return {
      title: 'Kananek T.',
      meta: [
        { hid: 'description', name: 'description', content: 'this.$store.state.resume.desc' },
        { name: 'google-site-verification', content: '8a9UqVi_ZQz5803x05WQzQZKK5E7XtKedN646oAHpas' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: 'this.$store.state.resume.page' },
        { property: 'og:description', content: 'this.$store.state.resume.desc' },
        { property: 'og:url', content: 'https://kananek-thongkam.touno.io/' },
        { property: 'og:site_name', content: 'Kananek T.' },
        { property: 'og:updated_time', content: '2017-11-30T23:33:14+00:00' },
        { property: 'og:image', content: 'https://kananek-thongkam.touno.io/fb-image.jpg' },
        { property: 'article:publisher', content: 'https://www.facebook.com/touno.io' },
        { property: 'article:author', content: 'https://www.facebook.com/touno.io' },
        { property: 'article:section', content: 'STORIES' },
        { property: 'article:published_time', content: '2017-11-30T23:33:14+00:00' },
        { property: 'article:modified_time', content: '2017-11-30T23:33:14+00:00' },
        { property: 'twitter:card', content: 'summary_large_image' },
        { property: 'twitter:description', content: 'this.$store.state.resume.desc' },
        { property: 'twitter:title', content: 'this.$store.state.resume.page' },
        { property: 'twitter:site', content: '@dvgamerr' },
        { property: 'twitter:image', content: 'https://kananek-thongkam.touno.io/fb-image.jpg' },
        { property: 'twitter:creator', content: '@dvgamerr' }
      ]
    }
  }
}
</script>

<style>

</style>