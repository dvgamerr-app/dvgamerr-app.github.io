module.exports = {
  head: {
    meta: [
      { charset: 'utf-8' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'MobileOptimized', content: 'width' },
      { name: 'HandheldFriendly', content: 'true' }
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/icon-32.png' },
      { rel: 'apple-touch-icon', sizes: '114x114', href: '/icon-114.png' },
      { rel: 'apple-touch-icon', sizes: '72x72', href: '/icon-72.png' },
      { rel: 'apple-touch-icon', sizes: '57x57', href: '/icon-57.png' },
      { rel: 'apple-touch-startup-image', type: 'image/png', href: '/icon-512.png' }
    ]
  },
  loading: { color: '#3B8070' },
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
    },
    loader: {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: {
          scss: 'vue-style-loader!css-loader!sass-loader', // <style lang="scss">
          sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax' // <style lang="sass">
        }
      }
    }
  },
  css: [
    'styles/index.scss',
    'bootstrap-vue/dist/bootstrap-vue.css'
  ],
  plugins: [
    'plugins/bootstrap-vue.js',
    'plugins/fontawesome.js'
  ],
  modules: [
    [ '@nuxtjs/google-adsense', { id: 'ca-pub-4905039106786059' } ],
    [ '@nuxtjs/google-analytics', { id: 'UA-70130307-4' } ]
  ]
}
