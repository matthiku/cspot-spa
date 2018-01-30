import firebase from 'firebase'
import { firebaseApp, usersRef, rolesRef } from '../../firebaseApp'

export default {
  state: {
    oldRoute: null,
    users: null,
    user: null
  },

  mutations: {
    setOldRoute (state, payload) {
      state.oldRoute = payload
    },
    setUser (state, payload) {
      state.user = payload
    },
    setUserRole (state, payload) {
      state.user.roles.push(payload)
    },
    setUserRoles (state, payload) {
      state.user.roles = payload
    },
    setUsers (state, payload) {
      state.users = payload
    }
  },

  actions: {
    refreshUsers ({commit, dispatch}) {
      console.log('updating local USERS list with full one-off snapshot from Server')
      usersRef
        .once('value')
        .then((data) => {
          commit('setUsers', data.val())
        })
        .catch((error) => dispatch('errorHandling', error))
    },

    // called from -> startUpActions <- only!
    // Triggered by a change in the Auth state of firebase
    // contains data from the Firebase Auth DB, not our own!
    setUser ({ commit, dispatch }, payload) {
      const userData = {
        id: payload.uid,
        email: payload.email,
        verified: payload.emailVerified,
        name: payload.displayName,
        providerData: payload.providerData
      }
      commit('setUser', userData)
      // here we should check the Vuex store with dispatch(loadallitems)
      dispatch('loadAllItems')
      dispatch('updateUser', userData)
    },

    // update firebase user table
    updateUser ({commit, dispatch}, payload) {
      if (!payload.id) return
      usersRef.child(payload.id).update(payload)
        .then(() => {
          commit('setLoading', false)
        })
        .catch(error => dispatch('errorHandling', error))
    },

    updateUserProfile ({state, commit, dispatch}, payload) {
      commit('setLoading', true)
      // if this is the current user: update firebase user profile
      if (payload.id === state.user.id) {
        firebaseApp.auth().currentUser.updateProfile({
          displayName: payload.name
        })
        .then(
          () => {
            commit('appendMessage', 'User\'s Firebase data was updated!')
          },
          error => dispatch('errorHandling', error))
      }
      // update project-specific user table
      dispatch('updateUser', payload)
      commit('appendMessage', 'This user\'s profile was updated')
    },

    loadUsers ({commit, dispatch}) {
      commit('setLoading', true)
      usersRef
        .once('value')
        .then(data => {
          const values = data.val()
          commit('setUsers', values)
          commit('setLoading', false)
        })
        .catch(error => dispatch('errorHandling', error))
    },

    fetchUserData ({commit, dispatch}, payload) {
      if (!payload) {
        return
      }
      usersRef
        .child(payload.uid)
        .once('value')
        .then(data => {
          const values = data.val()
          if (values && values.roles) {
            commit('setUserRoles', values.roles)
          }
          commit('setLoading', false)
        })
        .catch(error => dispatch('errorHandling', error))
    },

    signUserOut ({commit, dispatch}) {
      commit('setLoading', true)
      commit('clearError')
      firebaseApp
        .auth()
        .signOut()
        .then(() => {
          // Sign-out successful.
          commit('setLoading', false)
          // clear the local state
          dispatch('clearAllItems')
        })
        .catch(error => dispatch('errorHandling', error))
    },

    signUserIn ({state, commit, dispatch}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebaseApp
        .auth()
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
          commit('setLoading', false)
          commit('setMessage', '')
        })
        .catch(error => dispatch('errorHandling', error))
    },

    sendEmailVerification ({commit, dispatch}) {
      let user = firebaseApp.auth().currentUser
      if (!user) return
      user
        .sendEmailVerification()
        .then(() => {
          commit('setMessage', 'Email verification email has been sent.')
          commit('setLoading', false)
        })
        .catch(error => dispatch('errorHandling', error))
    },

    singinViaProvider ({commit, dispatch}, provider) {
      if (provider === 'google') {
        provider = new firebase.auth.GoogleAuthProvider()
        firebaseApp
          .auth()
          .signInWithPopup(provider)
          .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            // var token = result.credential.accessToken
            // The signed-in user info.
            var user = result.user
            console.log(user)
            // ...
          })
          .catch((error) => dispatch('errorHandling', error))
      }
    },

    signUserUp ({ commit, dispatch }, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebaseApp
        .auth()
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
          const newUser = { id: user.uid, email: payload.email }
          usersRef
            .once('value')
            .then(data => {
              if (!data.val()) {
                console.log(
                  'We have the first user and she/he will become Admin!'
                )
                newUser.roles = ['admin']
              } else {
                newUser.roles = ['user']
              }
              // add new user to our own users table
              // console.log('saving new user profile to fb:', newUser)
              usersRef
                .child(newUser.id)
                .set(newUser)
                .then(() => {
                  // update the roles table with this user
                  rolesRef
                    .child(newUser.roles[0])
                    .child('users')
                    .child(newUser.id).set(true)
                    .then(() => {
                      dispatch('loadUsers')
                      commit('setLoading', false)
                    })
                    .catch(error => dispatch('errorHandling', error))
                })
                .catch(error => dispatch('errorHandling', error))
            })
            .catch(error => dispatch('errorHandling', error))
        })
        .catch(error => dispatch('errorHandling', error))
    },

    setOldRoute ({ commit }, payload) {
      commit('setOldRoute', payload)
    }
  },

  getters: {
    oldRoute (state) {
      return state.oldRoute
    },
    user (state) {
      return state.user
    },
    users (state) {
      return state.users
    },
    userIsAdmin (state) {
      if (!state.user) { return false }
      if (state.user.roles) {
        return state.user.roles.indexOf('admin') > -1
      }
      if (!state.users) { return false }
      if (!state.users[state.user.id]) { return false }
      return state.users[state.user.id].roles.indexOf('admin') > -1
    }
  }
}
