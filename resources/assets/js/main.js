/**
 * Main application as called from within the main view (app.blade.php)
 * 
 * (C) 2018 Matthias Kuhs
 */
import Vue from 'vue'
import Vuetify from 'vuetify'

import vueCalendar from 'vue2-simple-calendar';
Vue.use(vueCalendar, {
  // configuration goes here.
});

// use customized styling
import '../stylus/main.styl'

// Main application objects
import App from './App'
import router from './router'
import { store } from './store'

Vue.use(Vuetify, {
  theme: {
    primary: '#40AE48' // = 'RGB(64, 174, 72)'
  }
})
Vue.config.productionTip = false

// provide the moment library to all components
import moment from 'moment-timezone'
moment.tz.setDefault('UTZ')
// add moment to the Vue prototype, so that we can use it in all components!
Object.defineProperty(Vue.prototype, '$moment', { get () { return this.$root.moment } })

// register the data filters
import filters from './filters/'
filters()

// register the generic components
import sharedComponents from './sharedComponents'
sharedComponents()

import startUpActions from './startUpActions'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  data: { moment },
  render: h => h(App),
  created () {
    startUpActions(store, router)
  }
})
