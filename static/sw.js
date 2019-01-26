importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/26efa68d7c2a0c7a478d.js",
    "revision": "e0ff1cf73aacefc8923d8ea3697923d3"
  },
  {
    "url": "/_nuxt/276074314df2806bdec7.js",
    "revision": "16fcb25c75ecd64e21670e53a1b77c77"
  },
  {
    "url": "/_nuxt/2b53a9ae8c749373c972.js",
    "revision": "c8df252cef6dedf6f5c15fee1dc765ca"
  },
  {
    "url": "/_nuxt/3f0b838b62f42fa48d36.js",
    "revision": "6022eb4d0d84105d75d0628615a10312"
  },
  {
    "url": "/_nuxt/9330c8262e4d88fd0f05.js",
    "revision": "1fd63896c2c7e488eca1b294c49425a0"
  },
  {
    "url": "/_nuxt/eddee29dfddccdb30a91.js",
    "revision": "8a0d70e5898349492d0b1900cc41c342"
  },
  {
    "url": "/_nuxt/f40e143dda160fcf6c3c.js",
    "revision": "9f6b0425760914fb908c35b327093b50"
  }
], {
  "cacheId": "web.profile-resume",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')
