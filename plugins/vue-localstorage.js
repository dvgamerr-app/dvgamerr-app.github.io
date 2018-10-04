import Vue from 'vue'
import VueLocalStorage from 'vue-localstorage'
 
Vue.use(VueLocalStorage, {
  name: 'ls',
  bind: true //created computed members from your variable declarations
})
