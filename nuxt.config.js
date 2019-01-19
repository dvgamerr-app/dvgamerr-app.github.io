let title = 'Kananek T.'
let desc = `Hey there, My name is Kananek T. and I'm a Full Stack Developer.`

module.exports = {
  mode: 'spa',
  head: {
    titleTemplate: t => `${t || ''}Kananek T.`,
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Hind:300,400,500,600,700' }
    ]
  },
  workbox: {
    // Workbox options
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'application-name', content: title },
    { name: 'description', content: desc, id: 'desc' },
    { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    { name: 'MobileOptimized', content: 'width' },
    { name: 'HandheldFriendly', content: 'true' }
  ],
  icons: { },
  loading: '~/components/preload.vue',
  manifest: {
    name: title,
    lang: 'en',
    dir: 'rtl',
    description: '',
    short_name: title,
    icons: [
      { src: '/icon-120.png', sizes: '64x64' },
      { src: '/icon-144.png', sizes: '128x128' },
      { src: '/icon-144.png', sizes: '144x144' }
    ], 
    scope: '/',
    start_url: '/',
    display: 'fullscreen',
    orientation: 'portrait',
    theme_color: '#ffffff',
    background_color: '#ffffff',
    screenshots: [
      {
        src: '/images/640x480.jpg',
        sizes: '640x480',
        type: 'image/jpeg'
      },
      {
        src: '/images/1280x920.jpg',
        sizes: '1280x920',
        type: 'image/jpeg'
      }
    ],
    browser_action: {
      default_icon: '/icon-120.png',
      default_popup: '/'
    }
  },
  css: [
    '~assets/scss/index.scss'
  ],
  plugins: [
    '~/plugins/vue-fontawesome.js'
  ],
  modules: [
    [ '@nuxtjs/google-adsense', { id: 'ca-pub-4905039106786059' } ],
    [ '@nuxtjs/google-analytics', { id: 'UA-70130307-4' } ]
  ],
  build: {
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}

