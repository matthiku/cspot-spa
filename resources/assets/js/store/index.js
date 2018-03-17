/**
 * central register for all Vuex store modules
 * 
 * (C) 2018 Matthias Kuhs
 */
import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'
axios.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest',
  'X-CSRF-TOKEN': window.csrf_token
};

import present from './present'
import shared from './shared'
import user from './user'
import plan from './plan'
import song from './song'
import type from './type'
import role from './role'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    present,
    shared,
    user,
    plan,
    song,
    type,
    role
  }
})
