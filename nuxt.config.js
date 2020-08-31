/* eslint-disable nuxt/no-cjs-in-config */
const production = !(process.env.NODE_ENV === 'development')

module.exports = {
  mode: 'universal',
  target: 'server',
  telemetry: false,
  head: {
    titleTemplate: title => `${title ? `${title} • ` : ''}DigitalLover Fansub`
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'application-name', content: 'DigitalLover Fansub' },
    { name: 'name', content: 'DigitalLover Fansub' },
    { name: 'description', content: 'DigitalLover Fansub Non-Profit Thai Fansub Group', id: 'desc' },
    { name: 'keywords', content: 'dl-fs,dl,fansub,anime,manga,novel' },
    { name: 'viewport', content: 'width=device-width, user-scalable=no' },
    { name: 'apple-mobile-web-app-title', content: 'DigitalLover Fansub' },
    { name: 'author', content: 'Mr.Kananek T.' }
  ],
  pwa: {
    manifest: {
      name: 'DL-Fansub',
      lang: 'en',
      description: '',
      short_name: 'DL-Fansub',
      start_url: '/',
      display: 'fullscreen',
      orientation: 'portrait',
      theme_color: '#F7F7F7',
      background_color: '#F7F7F7',
      browser_action: {
        default_icon: '/icon-16.png',
        default_popup: '/'
      },
      icons: [
        {
          src: '/icon-16.png',
          sizes: '16x16',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: '/icon-64.png',
          sizes: '64x64',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: '/icon-256.png',
          sizes: '196x196',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      offlinePage: ['/'],
      runtimeCaching: [
        {
          urlPattern: 'https://localhost:3000/.*',
          handler: 'networkFirst',
          method: 'GET',
          strategyOptions: {
            cacheName: 'my-api-cache',
            cacheableResponse: { statuses: [0, 200] }
          }
        }
      ]
    }
  },
  loading: '~/components/top-loading.vue',
  css: [
    './assets/scss/index.scss'
  ],
  plugins: [
    '~/plugins/vue-tabindex.js',
    '~/plugins/vue-orm-axios.js'
  ],
  components: false,
  buildModules: [
    '@nuxtjs/fontawesome',
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module'
  ],
  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/pwa'
  ],
  router: {
    middleware: ['auth'],
    linkActiveClass: 'active',
    linkExactActiveClass: 'exact-active'
  },
  bootstrapVue: { bootstrapCSS: false },
  fontawesome: {
    component: 'fa',
    icons: { solid: true, regular: true, brands: true }
  },
  build: {
    parallel: !production,
    cache: true,
    extractCSS: production,
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: { name: 'styles', test: /\.(css|vue)$/, chunks: 'all', enforce: true }
        }
      }
    }
  },
  render: {
    http2: {
      push: true,
      pushAssets: (req, res, publicPath, preloadFiles) => preloadFiles
        .filter(f => f.asType === 'script' && f.file === 'runtime.js')
        .map(f => `<${publicPath}${f.file}>; rel=preload; as=${f.asType}`)
    }
  },
  auth: {
    strategies: {
      local: {
        //       endpoints: {
        //         login: { url: '/auth/login', method: 'post', propertyName: 'token' },
        //         logout: { url: '/auth/logout', method: 'post' },
        //         user: { url: '/auth/user', method: 'get', propertyName: 'user' }
        //       }
      }
    }
    //   redirect: { login: '/sign-in', logout: '/sign-in', home: '/' }
  },
  server: { port: 3000, host: '0.0.0.0', timing: false },
  axios: { baseURL: process.env.AXIOS_BASE_URL },
  env: {
    dev: !production
  }
}
