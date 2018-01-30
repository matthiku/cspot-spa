import { typesRef, binRef } from '../../firebaseApp'

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
    refreshTypes ({commit, dispatch}) {
      console.log('updating local list of TYPES with full one-off snapshot from Server')
      typesRef
        .once('value')
        .then(data => {
          dispatch('loadTypes', data)
        })
        .catch(error => dispatch('errorHandling', error))
    },

    // load existing types from the DB
    loadTypes ({commit}, payload) {
      let types = []
      // payload is a firebase data snapshot
      payload.forEach(type => {
        let item = type.val()
        item.id = type.key
        types.push(item)
      })
      commit('setLoading', false)
      commit('setTypes', types)
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
