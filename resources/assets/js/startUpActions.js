// import { firebaseApp, plansRef, songsRef, typesRef, rolesRef, usersRef } from './firebaseApp'

export default function startUpActions (store, router) {
  // run actions at the start of the App

  // check if a user is already logged on in the browser session
  var user
  try {
    user = JSON.parse(window.cspot2_server_data).user
  } catch (error) {
    console.log(error, 'No user is signed in. FROM: ', from)
  }
  if (user) {
    store.dispatch('setUser', user)
    // store.dispatch('fetchUserData', user)
  } else {
    // user is not signed in yet, so we store the desired page and let the user sign in first
    let from = store.getters.oldRoute
    if (from && from.name !== 'signin' && from.name !== 'home') {
      from = '?from=' + from.name
    } else {
      from = false
    }
    router.replace('/login')
  }

  setTimeout(() => {
    // check if the initial loading of data (see below) had already been successful
    store.dispatch('loadAllItems')
  }, 3000)

  // // sync with existing PLANS from firebase
  // plansRef.on('value', snap => {
  //   // console.log('plans DB was modified!')
  //   store.dispatch('loadPlans', snap)
  // })

  // // sync with TYPES table
  // typesRef.on('value', snap => {
  //   if (!snap) {
  //     console.log('error when trying to fetch types table!')
  //   }
  //   store.dispatch('loadTypes', snap)
  // })
  // // .catch(error => store.dispatch('errorHandling', 'TYPES table: ' + error))

  // // sync with ROLES table
  // rolesRef.on('value', snap => {
  //   store.dispatch('loadRoles', snap)
  // })

  // // sync with SONGS table
  // songsRef.on('value', snap => {
  //   store.dispatch('loadSongs', snap)
  // })

  // // sync with USERS table
  // usersRef.on('value', snap => {
  //   store.dispatch('loadUsers', snap)
  // })

  // // check if we need to load some backend data
  // router.beforeEach((from, to, next) => {
  //   // no data needed for the auth pages
  //   if (to.name === 'signin') next()
  // })

}
