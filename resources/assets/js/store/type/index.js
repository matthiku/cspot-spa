import axios from 'axios'

// import { typesRef } from '../../firebaseApp'

export default {
  state: {
    types: 'loading'
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
    refreshTypes ({state, commit, dispatch}, payload) {
      if (payload === 'init' || !(state.types instanceof Object) || state.types === 'loading') {
        let reason = payload === 'init' ? payload : state.types === 'loading' ? 'not loaded' : 'object empty'
        console.log('updating local list of TYPES from Server, reason:', reason)
        axios.get('/api/type')
          .then(data => {
            if (data.data.forEach) {
              let types = {}
              // turn array into an object
              data.data.forEach(elem => {
                let obj = elem
                types[obj.id] = elem
              })
              commit('setTypes', types)
            } else {
              console.warn(data)
            }
          })
          .catch(error => console.warn(error))
      } else {
        console.log('TYPES still up-to-date')
      }
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
