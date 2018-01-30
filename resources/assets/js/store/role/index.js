import { rolesRef, binRef } from '../../firebaseApp'

export default {
  state: {
    roles: []
  },

  mutations: {
    setRoles (state, payload) {
      state.roles = payload
    },
    addDummyRole (state, payload) {
      state.roles[payload.id] = payload
    }
  },

  actions: {
    refreshRoles ({commit, dispatch}) {
      console.log('updating local list of ROLES with full one-off snapshot from Server')
      rolesRef.once('value')
      .then((data) => {
        dispatch('loadRoles', data)
      })
      .catch((error) => dispatch('errorHandling', error))
    },

    // load existing roles from the DB (called from startUpActions)
    loadRoles ({commit}, payload) {
      commit('setRoles', payload.val())
      commit('setLoading', false)
    },

    updateRole ({state, commit, dispatch}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      // for a name change, we also need to change the id
      // which means creating a copy and deleting the old node
      if (payload.field === 'name') {
        Object.assign(updateObj, state.roles[payload.id])
        updateObj.id = payload.value
        rolesRef.child(payload.value).set(updateObj)
        return
      }
      updateObj[payload.field] = payload.value
      rolesRef.child(payload.id).update(updateObj)
        .then(() => {
          commit('setMessage', 'Role updated!')
          commit('setLoading', false)
        })
        .catch((error) => dispatch('errorHandling', error))
    },

    addDummyRole ({commit}, payload) {
      // adding a local-only dummy role before it get's its proper name
      commit('addDummyRole', payload)
    },

    removeRole ({commit, dispatch}, payload) {
      commit('setLoading', true)
      // first, move the old role to the bin
      binRef.child('roles/' + payload.name).set(payload)
        .then(() => {
          commit('setMessage', 'role moved into the bin...')
          rolesRef.child(payload.id).remove()
          .then(() => {
            commit('setMessage', 'role removed and placed in the bin!')
            commit('setLoading', false)
          })
          .catch((error) => dispatch('errorHandling', error))
        })
        .catch((error) => dispatch('errorHandling', error))
    },
    // update the users for a list of roles
    updateRolesUserList ({commit, dispatch}, payload) {
      // console.log('updateRolesUserList', payload)
      // payload contains a user, add-roles and remove-roles objects
      commit('setLoading', true)
      // first, go through the list of roles to be added
      if (Object.keys(payload.add).length) { commit('appendMessage', 'User was added to a role') }
      for (const key in payload.add) {
        if (payload.add.hasOwnProperty(key)) {
          const element = payload.add[key]
          // console.log(payload.user.name, 'adding to role', element)
          rolesRef.child(element).child('users').child(payload.user.id).set(true)
            .catch((error) => dispatch('errorHandling', error))
        }
      }
      if (Object.keys(payload.remove).length) { commit('appendMessage', 'User was removed from a role') }
      for (const key in payload.remove) {
        if (payload.remove.hasOwnProperty(key)) {
          const element = payload.remove[key]
          // console.log(payload.user.name, 'removing from role', element)
          rolesRef.child(element).child('users').child(payload.user.id).remove()
          .catch((error) => dispatch('errorHandling', error))
        }
      }
    }
  },

  getters: {
    roles (state) {
      return state.roles
    }
  }
}
