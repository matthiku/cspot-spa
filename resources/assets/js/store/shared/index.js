import axios from 'axios'

export default {
  state: {
    appName: 'c-SPOT-SPA',
    loading: false,
    message: '',
    error: '',
    search: { filter: '' },
    dialogShow: false,
    dialog: { field: '', item: null, updated: false },
    admin: { selectedTab: '' },
    // object to save the status of pages (open or closed drawers for instance)
    pageStatus: {}
  },

  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    setMessage (state, payload) {
      setTimeout(() => {
        state.message = ''
      }, 9000)
      state.message = payload
    },
    appendMessage (state, payload) {
      setTimeout(() => {
        state.message = ''
      }, 9000)
      state.message = (state.message ? state.message + ' - ' : '') + payload
    },
    setDialog (state, payload) {
      state.dialog = payload
    },
    hideDialog (state) {
      state.dialogShow = false
    },
    showDialog (state) {
      state.dialogShow = true
    },
    clearError (state) {
      state.error = ''
    },
    clearMessage (state) {
      state.message = ''
    }
  },

  actions: {
    loadAllItems ({rootState, dispatch}) {
      if (!rootState.user.user) {
        console.log('(loadAllItems) user not signed in!', rootState.user)
        return
      }
      // make sure we always have the latest token!
      axios.defaults.headers.common = { 'X-CSRF-TOKEN': window.csrf_token }

      dispatch('refreshUsers', 'init')
      dispatch('refreshRoles', 'init')
      dispatch('refreshTypes', 'init')
      dispatch('refreshSongs', 'init')
      dispatch('refreshPlans', 'init')
      // repeat this later with conditions
      setTimeout(() => {
        console.log('checking all items....')
        dispatch('refreshAllItems')
      }, 2000)      
    },

    refreshAllItems ({rootState, dispatch}) {
      if (!rootState.user.user) {
        console.log('(refreshAllItems) user not signed in!', rootState.user.user)
        return
      }            
      dispatch('refreshRoles')
      dispatch('refreshTypes')
      dispatch('refreshUsers')
      dispatch('refreshSongs')
      dispatch('refreshPlans')

      // repeat this every 5 mins (30 secs for tests)
      setTimeout(() => {
        // check if the initial loading of data (see below) had already been successful
        console.log('re-checking all items....')
        dispatch('refreshAllItems')
      }, 300000)      
    },

    clearAllItems ({commit}) {
      commit('setUsers', [])
      commit('setUser', null)
      commit('setPlan', null)
      commit('setPlans', [])
      commit('setTypes', [])
      commit('setSongs', [])
      commit('setRoles', [])
    },

    clearError ({ commit }) {
      commit('clearError')
    },

    clearMessage ({ commit }) {
      commit('clearMessage')
    },

    setLoading ({ commit }, payload) {
      commit('setLoading', payload)
    },

    setMessage ({ commit }, payload) {
      commit('setMessage', payload)
    },

    appendMessage ({ commit }, payload) {
      commit('appendMessage', payload)
    },

    setDialog ({ commit }, payload) {
      commit('setDialog', payload)
    },

    hideDialog ({ commit }) {
      commit('hideDialog')
    },

    showDialog ({ commit }) {
      commit('showDialog')
    },

    errorHandling ({ commit }, payload) {
      let text = payload
      // show typical attributes of error messages if available
      if (text.errors) text = text.errors
      if (text.message) text = text.message
      if (text.code) text = text.code
      commit('setError', text)
      console.log(payload)
      commit('setLoading', false)
    }
  },

  getters: {
    error (state) {
      return state.error
    },
    message (state) {
      return state.message
    },
    loading (state) {
      return state.loading
    },
    search (state) {
      return state.search
    },
    appName (state) {
      return state.appName
    },
    dialog (state) {
      return state.dialog
    },
    dialogShow (state) {
      return state.dialogShow
    },
    admin (state) {
      return state.admin
    },
    pageStatus (state) {
      return state.pageStatus
    }
  }
}
