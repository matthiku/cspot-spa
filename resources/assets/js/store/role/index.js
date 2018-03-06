import axios from 'axios'

export default {
  state: {
    roles: 'loading',
    rolesByName: null
  },

  mutations: {
    setRoles(state, payload) {
      state.roles = payload
      if (Object.values(payload)) {
        state.rolesByName = {}
        Object.values(payload).forEach(elem => {
          state.rolesByName[elem.name] = elem.id
        })
      }
    },
    addDummyRole(state, payload) {
      state.roles[payload.id] = payload
    }
  },

  actions: {
    refreshRoles({ state, commit, dispatch }, payload) {
      if (
        payload === 'init' ||
        !(state.roles instanceof Object) ||
        state.roles instanceof Array
      ) {
        let reason = payload === 'init' ? payload : 'object empty'
        console.log('updating local list of ROLES from Server, reason:', reason)
        axios
          .get('/api/role')
          .then(data => {
            if (data.data.forEach) {
              // turn array into an object
              let roles = {}
              data.data.forEach(elem => {
                let obj = elem
                roles[obj.id] = elem
              })
              commit('setRoles', roles)
            } else {
              console.warn('refreshRoles: unexpected response!', data)
            }
          })
          .catch(error => console.warn(error))
      }
    },

    updateRole({ state, commit, dispatch }, payload) {
      // deviate, if this is for creating a new ROLE
      if (payload.id === 'new') {
        dispatch('addRole', payload)
        return
      }
      commit('setLoading', true)
      axios
        .patch(`/api/role/${payload.id}`, payload)
        .then(data => {
          // use returned ROLE object to update the local list of ROLES
          state.roles = data.data
          commit('setMessage', `Role "${data.data.name}" updated!`)
          commit('setLoading', false)
        })
        .catch(error => dispatch('errorHandling', error))
    },

    addDummyRole({ commit }, payload) {
      // adding a local-only dummy role before it get's its proper name and id
      commit('addDummyRole', payload)
    },

    addRole({ state, commit }, payload) {
      commit('setLoading', true)
      axios
        .post('/api/role', payload)
        .then(data => {
          // when successful, will return full list of ROLES
          state.roles = data.data
          commit('setMessage', `Role "${data.data.name}" created!`)
          commit('setLoading', false)
        })
        .catch(error => dispatch('errorHandling', error))
      },
      
      removeRole({ state, commit, dispatch }, payload) {
        commit('setLoading', true)
        // first, move the old role to the bin
        axios
        .delete(`/api/role/${payload.id}`)
        .then(data => {
          // when successful, will return full list of ROLES
          state.roles = data.data
          commit('setMessage', 'role removed')
          commit('setLoading', false)
        })
        .catch(error => dispatch('errorHandling', error))
    }
  },

  getters: {
    roles(state) {
      return state.roles
    },
    rolesByName(state) {
      return state.rolesByName
    }
  }
}
