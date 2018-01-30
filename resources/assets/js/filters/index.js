import Vue from 'vue'

import * as dateFilters from './date'
import * as stringFilters from './string'

export default function filters () {
  Vue.filter('date', dateFilters.date)
  Vue.filter('dateShort', dateFilters.dateShort)
  Vue.filter('time', dateFilters.time)
  Vue.filter('weekdayName', dateFilters.weekdayName)

  Vue.filter('firstWord', stringFilters.firstWord)
  Vue.filter('ucFirst', stringFilters.ucFirst)
  Vue.filter('sentenceMax', stringFilters.sentenceMax)
  Vue.filter('maxLines', stringFilters.maxLines)
}
