import Vue from 'vue'
import Vuex from 'vuex'

import shared from './shared'
import user from './user'
import plan from './plan'
import song from './song'
import type from './type'
import role from './role'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    shared,
    user,
    plan,
    song,
    type,
    role
  }
})
