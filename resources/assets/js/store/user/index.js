import axios from 'axios'

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
      console.log('updating local USERS list from Server')
      axios.get('/api/user')
        .then((data) => {
          if (data.data) {
            commit('setUsers', data.data)
          }
        })
        .catch((error) => dispatch('errorHandling', error))
    },

    // update firebase user table
    updateUser ({commit, dispatch}, payload) {
      if (!payload.id) return
      console.log(payload)
      // usersRef.child(payload.id).update(payload)
      axios.post(`api/user/${payload.id}/update/`)
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

    fetchUserData ({commit, dispatch}, payload) {
      if (!payload) {
        return
      }
      console.log(payload)
      axios.get(`/api/user/${payload.id}/get`)
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
      axios({
        method: 'post',
        url: '/logout',
        data: {
          _token: window.csrf_token
        }
      })
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
      axios({
        method: 'post',
        url: '/login',
        data: {
          email: payload.email,
          password: payload.password,
          _token: window.csrf_token
        },
        headers: { 'Content-Type': 'application/json' },
        // `validateStatus` defines whether to resolve or reject the promise for a given
        // HTTP response status code. If `validateStatus` returns `true` (or is set to `null`
        // or `undefined`), the promise will be resolved; otherwise, the promise will be rejected.
        validateStatus: function (status) {
          return status >= 200 && status < 500; // default
        }
      })
      .then(data => {
        commit('setLoading', false)
        if (data.status && data.status != 200) {
          dispatch('errorHandling', data.data.errors)
          return
        }
        if (data.data) {
          /**
           * object 'data.data' contains -
           * auth : true
           * intended : "/" 
           * user : {…}
           */
          commit('setMessage', '')
          commit('setUser', data.data.user)
          // load all entities from the backend
          dispatch('loadAllItems')
        } else {
          commit('setMessage', 'log in error')
          console.log(data)         
        }
      })
      .catch((error) => {
        dispatch('errorHandling', error)
      })
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

    signinViaProvider ({commit, dispatch}, provider) {
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
        return state.user.roles.find(elem => elem.id === 1 || elem.name === 'administrator') ? true : false
      }
      if (!state.users) { return false }
      if (!state.users[state.user.id]) { return false }
      if (!state.users[state.user.id].roles) { return false }
      return state.users[state.user.id].roles.indexOf('admin') > -1
    }
  }
}
