<template>
  <div>
    <!-- <preload/> -->
    <navigation/>
    <nuxt/>
  </div>
</template>

<script>
import preload from '~/components/preload.vue'
import navigation from '~/components/navigation.vue'

export default {
  components: {
    preload,
    navigation
  },
  head () {
    return {
      title: this.$store.state.resume.page,
      meta: [
        { hid: 'description', name: 'description', content: this.$store.state.resume.desc },
        { name: 'google-site-verification', content: '8a9UqVi_ZQz5803x05WQzQZKK5E7XtKedN646oAHpas' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: this.$store.state.resume.page },
        { property: 'og:description', content: this.$store.state.resume.desc },
        { property: 'og:url', content: 'https://touno.io/' },
        { property: 'og:site_name', content: 'Kananek T.' },
        { property: 'og:updated_time', content: '2017-11-30T23:33:14+00:00' },
        { property: 'og:image', content: 'https://touno.io/fb-image.jpg' },
        { property: 'article:publisher', content: 'https://www.facebook.com/touno.io' },
        { property: 'article:author', content: 'https://www.facebook.com/touno.io' },
        { property: 'article:section', content: 'STORIES' },
        { property: 'article:published_time', content: '2017-11-30T23:33:14+00:00' },
        { property: 'article:modified_time', content: '2017-11-30T23:33:14+00:00' },
        { property: 'twitter:card', content: 'summary_large_image' },
        { property: 'twitter:description', content: this.$store.state.resume.desc },
        { property: 'twitter:title', content: this.$store.state.resume.page },
        { property: 'twitter:site', content: '@dvgamerinfo' },
        { property: 'twitter:image', content: 'https://touno.io/fb-image.jpg' },
        { property: 'twitter:creator', content: '@dvgamerinfo' }
      ],
      script: [
        { src: '/js/jquery.js' },
        { src: '/js/jquery.magnific-popup.min.js' },
        { src: '/js/magnific-popup-options.js' },
        { src: '/js/smoothscroll.js' },
        { src: '/js/custom.js' }
      ]
    }
  }
}
</script>

<style lang="scss">
@import '../styles/vendor/magnific-popup.scss';
@import '../styles/vendor/style.scss';

body {
  background: #ffffff;
  font-family: 'Muli', sans-serif;
  font-style: normal;
  font-weight: 300;
  overflow-x: hidden;
}

html, body {
  width: 100%;
  height: 100%;
}

html{
  -webkit-font-smoothing: antialiased;
}

a {
  color: #575757;
  -webkit-transition: 0.5s;
  transition: 0.5s;
  text-decoration: none !important;
}

a:hover, a:active, a:focus {
  color: #000000;
  outline: none;
}

* {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

*:before,
*:after {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

h1,h2,h3,h4,h5,h6 {
  font-style: normal;
  font-weight: 200;
  letter-spacing: 0px;
}

h1 {
  color: #3d3d3f;
  font-size: 48px;
  line-height: normal;
}

h2 {
  color: #575757;
  font-size: 40px;
  line-height: 52px;
  margin-top: 0px;
}

h4 {
  color: #797979;
  font-size: 18px;
  font-weight: normal;
}

p {
    color: #878787;
    font-size: 16px;
    font-weight: 300;
    line-height: 25px;
    letter-spacing: 0.2px;
}

strong, span {
  color: #878787;
  font-weight: normal;
}

@media (min-width: 768px) and (max-width: 1024px) {
  #home {
    height: 80vh;
  }
}

@media (min-width: 667px) and (max-width: 767px) {
  #home {
    height: 140vh;
  }
}

@media (min-width: 568px) and (max-width: 665px) {
  #home {
    height: 190vh;
  }
}

@media (max-width: 980px) {
  h1 {
    font-size: 33px;
  }
  #work .work-thumb {
    margin-top: 30px;
  }
}


@media (max-width: 768px) {
  h1 {
    font-size: 30px;
    line-height: normal;
  }
  h2  {
    font-size: 30px;
  }
}


@media (max-width: 580px) {
  #about .about-thumb {
    margin-top: 0px;
  }
  .about-thumb .social-icon {
    margin-bottom: 15px;
  }
}


@media (max-width: 357px) {
  h1 {
    font-size: 28px;
  }
  #about .col-md-4 a {
    width: 85px;
    height: 85px;
  }

}

.section-title {
  margin: 0;
  padding-bottom: 32px;
}

#about, #contact {
  position: relative;
  padding-top: 80px;
  padding-bottom: 80px;
}
#work {
  position: relative;
  padding-top: 80px;
  padding-bottom: 30px;
}

#about img, #team img {
  border-radius: 5px;
}

#work {
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

#contact {
  text-align: center;
}

</style>
