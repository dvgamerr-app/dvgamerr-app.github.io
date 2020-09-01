const title = 'Mr.Kananek T.'
const desc = 'Hey there, My name is Kananek Thongkam and i\'m a Full Stack Engineer specialist.'
const website = 'https://mr.touno.io'
const date = new Date().toISOString()
const production = !(process.env.NODE_ENV === 'development')

// eslint-disable-next-line nuxt/no-cjs-in-config
module.exports = {
  mode: 'universal',
  target: 'server',
  telemetry: false,
  head: {
    titleTemplate: t => `${t || ''}Mr.Kananek T.`,
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'favicon.png' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Hind:300,400,500,600,700' }
    ],
    meta: [
      { charset: 'utf-8' },
      { name: 'application-name', content: title },
      { name: 'description', content: desc, id: 'desc' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
      { name: 'robots', content: 'noindex,noarchive,nofollow' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'MobileOptimized', content: 'width' },
      { name: 'HandheldFriendly', content: 'true' },
      { name: 'google-site-verification', content: '8a9UqVi_ZQz5803x05WQzQZKK5E7XtKedN646oAHpas' },
      { property: 'og:locale', content: 'en_US' },
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: desc },
      { property: 'og:url', content: `${website}/` },
      { property: 'og:site_name', content: title },
      { property: 'og:updated_time', content: date },
      { property: 'og:image', content: `${website}/fb-image.jpg` },
      { property: 'article:publisher', content: 'https://www.facebook.com/dvgamerr' },
      { property: 'article:author', content: 'https://www.facebook.com/dvgamerr' },
      { property: 'article:section', content: 'STORIES' },
      { property: 'article:published_time', content: date },
      { property: 'article:modified_time', content: date },
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:description', content: desc },
      { property: 'twitter:title', content: title },
      { property: 'twitter:site', content: '@dvgamerr' },
      { property: 'twitter:image', content: `${website}/fb-image.jpg` },
      { property: 'twitter:creator', content: '@dvgamerr' }
    ]
  },
  icons: {
    sizes: [32, 57, 72, 144, 512]
  },
  manifest: {
    name: title,
    lang: 'en',
    dir: 'rtl',
    description: '',
    short_name: title,
    icons: [
      { src: '/favicon.png', sizes: '64x64' },
      { src: '/favicon.png', sizes: '128x128' },
      { src: '/favicon.png', sizes: '144x144' }
    ],
    scope: '/',
    start_url: '/',
    display: 'fullscreen',
    orientation: 'portrait',
    theme_color: '#ffffff',
    background_color: '#ffffff',
    screenshots: [
      {
        src: '/images/fb-image.jpg',
        sizes: '640x480',
        type: 'image/jpeg'
      },
      {
        src: '/images/fb-image.jpg',
        sizes: '1280x920',
        type: 'image/jpeg'
      }
    ],
    browser_action: {
      default_icon: '/favicon.png',
      default_popup: '/'
    }
  },
  workbox: {
    // Workbox options
  },
  css: [
    '~assets/scss/index.scss'
  ],
  plugins: [
    '~/plugins/vue-tabindex.js',
    '~/plugins/vue-clipboards.js',
    '~/plugins/vue-tippy.js'
  ],
  render: {
    csp: true,
    http2: {
      push: true,
      pushAssets: (req, res, publicPath, preloadFiles) => preloadFiles
        .filter(f => f.asType === 'script' && f.file === 'runtime.js')
        .map(f => `<${publicPath}${f.file}>; rel=preload; as=${f.asType}`)
    }
  },
  modules: [
    ['nuxt-compress', { gzip: { cache: true }, brotli: { threshold: 10240 } }],
    ['@nuxtjs/axios', { https: process.env.NODE_ENV !== 'development' }],
    ['@nuxtjs/pwa', { icon: true }],
    ['nuxt-fontawesome', {
      component: 'fa',
      imports: [
        { set: '@fortawesome/free-solid-svg-icons', icons: ['fas'] },
        { set: '@fortawesome/free-brands-svg-icons', icons: ['fab'] },
        { set: '@fortawesome/free-regular-svg-icons', icons: ['far', 'faCopyright'] }
      ]
    }]
  ],
  server: { port: 3000, host: '0.0.0.0' },
  axios: { baseURL: process.env.AXIOS_BASE_URL || 'http://mr.touno.io/' },
  env: {
    dev: process.env.NODE_ENV === 'development',
    baseURL: process.env.AXIOS_BASE_URL || 'http://mr.touno.io/'
  },
  build: {
    quiet: false,
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
  }
}
