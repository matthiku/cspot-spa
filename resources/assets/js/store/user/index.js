import axios from 'axios'
import * as moment from 'moment'

export default {
  state: {
    oldRoute: null,
    users: 'loading',
    usersUpdatedAt: null,
    user: null
  },

  mutations: {
    setOldRoute(state, payload) {
      state.oldRoute = payload
    },
    setUser(state, payload) {
      state.user = payload
    },
    setUserRole(state, payload) {
      state.user.roles.push(payload)
    },
    setUserRoles(state, payload) {
      state.user.roles = payload
    },
    setUsers(state, payload) {
      state.users = payload
    },
    setUsersUpdateDate(state, payload) {
      state.usersUpdatedAt = payload
    }
  },

  actions: {
    refreshUsers({ state, commit, dispatch }, payload) {
      // first get date of latest update to USERS table
      axios
        .get('/api/user/latest')
        .then(data => {
          let updateDate = data.data.date
          let oldDate = state.usersUpdatedAt
          // console.log('setUsersUpdateDate', updateDate)
          if (oldDate === updateDate && state.users instanceof Object && (!state.users instanceof Array)) return
          commit('setUsersUpdateDate', updateDate)

          if (
            (payload === 'init' ||
              !(state.users instanceof Object) ||
              state.users instanceof Array) &&
            updateDate !== undefined
          ) {
            let reason =
              payload === 'init'
                ? payload
                : oldDate !== updateDate ? 'out-of-date' : 'object empty'
            console.log(
              'updating local list of USERS from Server, reason:',
              reason,
              state.users
            )
            if (reason === 'out-of-date') {
              console.log(oldDate, updateDate)
            }
            axios
              .get('/api/user')
              .then(data => {
                if (data.data.forEach) {
                  let users = {}
                  // turn array into an object
                  data.data.forEach(elem => {
                    let obj = elem
                    users[obj.id] = elem
                  })
                  commit('setUsers', users)
                } else {
                  console.warn(data)
                }
              })
              .catch(error => console.warn(error))
          } else if (updateDate === undefined) {
            console.warn('could not get USERS update date!')
          }
        })
        .catch(error => console.warn(error))
    },

    // update user record
    updateUser({ state, commit, dispatch }, payload) {
      if (!payload.id) return
      console.log('updateUser', payload)
      axios
        .patch(`/api/user/${payload.id}`, payload)
        .then((data) => {
          // update the user in the local Users List object
          state.users[payload.id] = data.data
          commit('setLoading', false)
        })
        .catch(error => dispatch('errorHandling', error))
    },

    addRoleToUser({ state, commit, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios
          .post(`/api/user/${payload.userId}/role`, { role_id: payload.roleId })
          .then(data => {
            // update corresponding user profile data
            state.users[payload.userId].roles = data.data
            if (state.user.id === payload.userId) {
              state.user.roles = data.data
            }
            commit(
              'appendMessage',
              `Role "${payload.name}" was added to this user`
            )
            commit('setLoading', false)
            resolve()
          })
          .catch(error => {
            commit('errorHandling', error)
            reject()
          })
      })
    },

    removeRoleFromUser({ state, commit, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios
          .delete(`/api/user/${payload.userId}/role/${payload.roleId}`)
          .then(data => {
            // update corresponding user profile data
            state.users[payload.userId].roles = data.data
            if (state.user.id === payload.userId) {
              state.user.roles = data.data
            }
            commit(
              'appendMessage',
              `Role "${payload.name}" was removed from this user`
            )
            commit('setLoading', false)
            resolve()
          })
          .catch(error => {
            commit('errorHandling', error)
            reject()
          })
      })
    },

    updateUserProfile({ state, commit, dispatch }, payload) {
      commit('setLoading', true)
      console.log('updateUserProfile', payload)
      // if this is the current user: update user profile
      if (payload.id === state.user.id) {
        axios.patch(`/api/user/${payload.id}`, payload).then(
          data => {
            // the data returned contains the full user record with roles
            commit('setUser', data.data)
            console.log(data.data)
            commit('appendMessage', "User's profile was updated!")
          },
          error => dispatch('errorHandling', error)
        )
      } else {
        // update project-specific user table
        dispatch('updateUser', payload)
      }
      commit('appendMessage', "This user's profile was updated")
    },

    fetchUserData({ commit, dispatch }, payload) {
      if (!payload) {
        return
      }
      console.log(payload)
      axios
        .get(`/api/user/${payload.id}/get`)
        .then(data => {
          const values = data.val()
          if (values && values.roles) {
            commit('setUserRoles', values.roles)
          }
          commit('setLoading', false)
        })
        .catch(error => dispatch('errorHandling', error))
    },

    signUserOut({ commit, dispatch }) {
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
          // clear header data
          window.cspot2_server_data = null
          // clear the local state
          dispatch('clearAllItems')
        })
        .catch(error => dispatch('errorHandling', error))
    },

    signUserIn({ state, commit, dispatch }, payload) {
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
        validateStatus: function(status) {
          return status >= 200 && status < 500 // default
        }
      })
        .then(data => {
          commit('setLoading', false)
          if (data.status && data.status != 200) {
            dispatch('errorHandling', data.data.errors)
            return
          }
          if (data.data) {
            let user
            // check if there is user data in the page header
            if (data.data.user) {
              user = data.data.user
              // store the intended URL that triggered the login
              if (data.data.intended) {
                commit('setOldRoute', data.data.intended)
              }
            } else if (window.cspot2_server_data) {
              let dt
              try {
                dt = JSON.parse(window.cspot2_server_data)
              } catch (error) {
                console.warn('backend data in header invalid or missing!')
              }
              console.log('header data', dt)
              if (dt.user) {
                user = dt.user
              } else {
                console.warn('backend failed to send user data!')
              }
              // check if there was user data in the HTTP response
            } else {
              console.warn('backend failed to send ANY data!')
              return
            }
            commit('setMessage', '')
            commit('setUser', user)
            // load all basic cspot entities from the backend
            dispatch('loadAllItems')
          } else {
            commit('setMessage', 'login error')
            console.log(data)
          }
        })
        .catch(error => {
          dispatch('errorHandling', error)
        })
    },

    sendEmailVerification({ commit, dispatch }) {
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

    signinViaProvider({ commit, dispatch }, provider) {
      if (provider === 'google') {
        provider = new firebase.auth.GoogleAuthProvider()
        firebaseApp
          .auth()
          .signInWithPopup(provider)
          .then(result => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            // var token = result.credential.accessToken
            // The signed-in user info.
            var user = result.user
            console.log(user)
            // ...
          })
          .catch(error => dispatch('errorHandling', error))
      }
    },

    signUserUp({ commit, dispatch }, payload) {
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
                    .child(newUser.id)
                    .set(true)
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
    }
  },

  getters: {
    oldRoute(state) {
      return state.oldRoute
    },
    user(state) {
      return state.user
    },
    users(state) {
      return state.users
    },
    userIsAdmin(state) {
      if (!state.user instanceof Object) {
        return false
      }
      if (state.user && state.user.roles) {
        let isAdmin = state.user.roles.find(
          elem => elem.id === 1 || elem.name === 'administrator'
        )
        return isAdmin ? true : false
      }
      return false
    }
  }
}
