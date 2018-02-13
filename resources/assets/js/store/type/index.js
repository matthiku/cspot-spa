import axios from 'axios'

// import { typesRef } from '../../firebaseApp'

export default {
  state: {
    types: []
  },
  mutations: {
    setTypes (state, payload) {
      state.types = payload
    },
    addDummyType (state, payload) {
      state.types[payload.id] = payload
    }
  },
  actions: {
    refreshTypes ({commit, dispatch}, payload) {
      console.log('updating local list of TYPES from Server')
      axios.get('/api/type')
        .then(data => {
          let types = {}
          // turn array into an object
          data.data.forEach(elem => {
            let obj = elem
            types[obj.id] = elem
          })
          commit('setTypes', types)
        })
        .catch(error => dispatch('errorHandling', error))
    },

    addDummyType ({commit}, payload) {
      // adding a local-only dummy plan TYPE before it get's its proper name
      commit('addDummyType', payload)
    },

    removeType ({commit, dispatch}, payload) {
      commit('setLoading', true)
      // first, move the old type to the bin
      binRef.child('types/' + payload.name).set(payload)
        .then(() => {
          commit('appendMessage', 'type "' + payload.name + '" moved into the bin...')
          typesRef.child(payload.id).remove()
          .then(() => {
            commit('appendMessage', 'type "' + payload.name + '" removed and placed in the bin!')
            commit('setLoading', false)
          })
          .catch((error) => dispatch('errorHandling', error))
        })
        .catch((error) => dispatch('errorHandling', error))
    },

    updateType ({commit, dispatch}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      updateObj[payload.field] = payload.value
      typesRef
        .child(payload.id)
        .update(updateObj)
        .then(() => {
          commit('setMessage', 'Type updated!')
          commit('setLoading', false)
        })
        .catch(error => dispatch('errorHandling', error))
    }
  },
  getters: {
    types (state) {
      return state.types
    }
  }
}
