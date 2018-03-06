import axios from 'axios'

// import { typesRef } from '../../firebaseApp'

export default {
  state: {
    typesArray: [],
    types: 'loading'
  },

  mutations: {
    setTypes(state, payload) {
      state.types = payload
    },
    setTypesArray(state, payload) {
      state.typesArray = payload
    }
  },

  actions: {
    refreshTypes({ state, commit, dispatch }, payload) {
      if (
        payload === 'init' ||
        !(state.types instanceof Object) ||
        state.types === 'loading' ||
        state.types instanceof Array
      ) {
        let reason =
          payload === 'init'
            ? payload
            : state.types === 'loading' ? 'not loaded' : 'object empty'
        console.log('updating local list of TYPES from Server, reason:', reason)
        axios
          .get('/api/type')
          .then(data => {
            if (data.data.forEach) {
              // save as array and as object
              commit('setTypesArray', data.data)
              let types = {}
              // turn array into an object
              data.data.forEach(elem => {
                let obj = elem
                types[obj.id] = elem
              })
              commit('setTypes', types)
            } else {
              console.warn('refreshTypes: Unexpected Response!', data)
            }
          })
          .catch(error => console.warn(error))
      }
    },

    removeType({ commit, dispatch }, payload) {
      commit('setLoading', true)
      axios
        .delete(`/api/type/${payload.id}`)
        .then(data => {
          // refresh the local list of TYPES with the response
          commit('setTypes', data.data)
          commit('setMessage', 'Type updated!')
          commit('setLoading', false)
        })
        .catch(error => dispatch('errorHandling', error))
    },

    addType({ commit, dispatch }, payload) {
      // add default start time (as it's a required field)
      payload.start = '10:00'
      payload.end = '11:00'
      axios
        .post(`/api/type`, payload)
        .then(data => {
          // refresh the local list of TYPES with the response
          commit('setTypes', data.data)
          commit('setMessage', 'Type created. Verify the default values and change if necessary!')
          commit('setLoading', false)
        })
        .catch(error => dispatch('errorHandling', error))
    },

    updateType({ commit, dispatch }, payload) {
      commit('setLoading', true)
      if (payload.id === 'new') {
        dispatch('addType', payload)
        return
      }
      axios
        .patch(`/api/type/${payload.id}`, payload)
        .then(data => {
          // refresh the local list of TYPES with the response
          commit('setTypes', data.data)
          commit('setMessage', 'Type updated!')
          commit('setLoading', false)
        })
        .catch(error => dispatch('errorHandling', error))
    }
  },

  getters: {
    types(state) {
      return state.types
    }
  }
}
