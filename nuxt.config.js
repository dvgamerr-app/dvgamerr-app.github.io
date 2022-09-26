const title = 'Mr. Kananek T.'
const desc = 'Hey there, My name is Kananek Thongkam and i\'m a Full Stack Engineer specialist.'
const website = 'https://mr.touno.io'
const date = new Date().toISOString()
const production = process.env.NODE_ENV !== 'development'


export default {
  ssr: false,
  target: 'static',
  telemetry: false,
  srcDir: 'src',
  server: { port: 8080 },
  head: {
    titleTemplate: t => `${t || ''}`,
    htmlAttrs: {
      lang: 'en'
    },
    link: [
      { rel: 'icon', type: 'image/x-icon', href: 'icon.webp' },
    ],
    script: [
      production ? {
        defer: true,
        src: 'https://static.cloudflareinsights.com/beacon.min.js',
        'data-cf-beacon': '{"token": "fb5b3ae4504f483f8a77f9d83d215c9c"}',
        body: true
      } : ''
    ],
    meta: [
      { charset: 'utf-8' },
      { name: 'application-name', content: title },
      { name: 'keywords', content: 'kananek,t.,kananek-thongkam,thongkam,tk,resume,kem,kanane,kt' },
      { name: 'description', content: desc, id: 'desc' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
      { name: 'viewport', content: 'width=device-width, user-scalable=no' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { property: 'og:locale', content: 'en_US' },
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: desc },
      { property: 'og:url', content: `${website}/` },
      { property: 'og:site_name', content: title },
      { property: 'og:updated_time', content: date },
      { property: 'og:image', content: `${website}/fb-image.png` },
      { property: 'article:publisher', content: 'https://twitter.com/dvgamerr' },
      { property: 'article:author', content: 'https://twitter.com/dvgamerr' },
      { property: 'article:section', content: 'STORIES' },
      { property: 'article:published_time', content: date },
      { property: 'article:modified_time', content: date },
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:description', content: desc },
      { property: 'twitter:title', content: title },
      { property: 'twitter:site', content: '@dvgamerr' },
      { property: 'twitter:image', content: `${website}/fb-image.png` },
      { property: 'twitter:creator', content: '@dvgamerr' }
    ]
  },
  icons: {
    sizes: [32, 57, 72, 144, 512]
  },
  pwa: {
    // manifest: {
    //   name: title,
    //   lang: 'en',
    //   dir: 'rtl',
    //   description: '',
    //   short_name: title,
    //   start_url: '/',
    //   scope: '/',
    //   display: 'fullscreen',
    //   orientation: 'portrait',
    //   theme_color: '#f8f8f8',
    //   background_color: '#f8f8f8',
    //   icons: [
    //     { src: '/icon-64.webp', sizes: '64x64' },
    //     { src: '/icon-128.webp', sizes: '128x128' },
    //     { src: '/icon-144.webp', sizes: '144x144' }
    //   ],
    //   screenshots: [
    //     {
    //       src: '/images/fb-image.png',
    //       sizes: '640x480',
    //       type: 'image/jpeg'
    //     },
    //     {
    //       src: '/images/fb-image.png',
    //       sizes: '1280x920',
    //       type: 'image/jpeg'
    //     }
    //   ],
    //   browser_action: {
    //     default_icon: '/icon.webp',
    //     default_popup: '/'
    //   }
    // },
    workbox: {
      // Workbox options
    }
  },
  loading: false,
  components: true,
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
    '~assets/scss/index.scss'
  ],
  plugins: [
    { src: '~/plugins/vue-notification.server.js', mode: 'server' },
    { src: '~/plugins/vue-notification.client.js', mode: 'client' },
    '~/plugins/vue-fontawesome.js',
    '~/plugins/vue-tabindex.js',
    '~/plugins/vue-clipboards.js',
    '~/plugins/vue-tippy.js'
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/color-mode',
    ['cookie-universal-nuxt', { alias: 'cookiz' }],
    '@nuxtjs/auth-next',
    ['bootstrap-vue/nuxt', { icon: false }],
    '@nuxtjs/robots',
    '@nuxtjs/markdownit',
    ['nuxt-compress', { gzip: { cache: true }, brotli: { threshold: 1024 } }]
  ],
  auth: {
    strategies: {
      sso: {
        scheme: '~/auth/sso',
        baseUrl: process.env.SSO_BASE_URL,
        appId: process.env.SSO_APP_ID,
        redirectUrl: process.env.SSO_APP_REDIRECT || 'http://localhost:8080'
      }
    },
    localStorage: { prefix: 'sso.' },
    cookie: { prefix: 'sso.' }
  },
  googleFonts: {
    prefetch: true,
    display: 'swap',
    families: {
      Roboto: true,
      Hind: [300,400,500,600,700]
    },
  },
  markdownit: {
    runtime: true,
    preset: 'default',
    linkify: true,
    breaks: true
  },
  robots: {
    UserAgent: '*',
    Allow: '/',
    Sitemap: 'https://mr.touno.io/sitemap.xml'
  },
  buildModules: [
    '@nuxtjs/fontawesome',
    '@nuxt/typescript-build',
    '@nuxtjs/google-fonts'
  ],
  build: {
    babel: { compact: true },
    parallel: true,
    terser: {
      parallel: true,
      cache: true,
      sourceMap: false,
    },
  },
  loaders: {
    scss: {},
  },
}


// export default {
//   // render: {
//   //   csp: true,
//   //   http2: {
//   //     push: true,
//   //     pushAssets: (req, res, publicPath, preloadFiles) => preloadFiles
//   //       .filter(f => f.asType === 'script' && f.file === 'runtime.js')
//   //       .map(f => `<${publicPath}${f.file}>; rel=preload; as=${f.asType}`)
//   //   }
//   // },
//   sitemap: {
//     hostname: 'https://mr.touno.io',
//     gzip: true,
//     exclude: []
//   },
//   publicRuntimeConfig: {
//     // axios: {
//     //   browserBaseURL: process.env.BROWSER_BASE_URL
//     // }
//   },
//   markdownit: {
//     runtime: true,
//     preset: 'default',
//     linkify: true,
//     breaks: true
//   },
//   robots: {
//     UserAgent: '*',
//     Allow: '/',
//     Sitemap: 'https://mr.touno.io/sitemap.xml'
//   },
//   optimizedImages: { optimizeImages: true },
//   googleAnalytics: { id: 'UA-70130307-4' },
//   env: {
//     dev: process.env.NODE_ENV === 'development'
//   },
//   fontawesome: {
//     icons: {
//       solid: true,
//       regular: ['faCopyright'],
//       brands: true
//     }
//   },
//   buildModules: [
//     '@nuxtjs/fontawesome',
//     '@nuxt/typescript-build'
//   ],
//   build: {
//     quiet: false,
//     parallel: !production,
//     cache: true,
//     extractCSS: production,
//     optimization: {
//       splitChunks: {
//         cacheGroups: {
//           styles: { name: 'styles', test: /\.(css|vue)$/, chunks: 'all', enforce: true }
//         }
//       }
//     }
//   }
// }
