import Vue from 'vue'
import fontawesome from '@fortawesome/fontawesome'
import brands from '@fortawesome/fontawesome-free-brands'
import solids from '@fortawesome/fontawesome-free-solid'

fontawesome.library.add(brands, solids)

Vue.use(fontawesome)
