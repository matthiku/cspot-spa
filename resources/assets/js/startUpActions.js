// import { firebaseApp, plansRef, songsRef, typesRef, rolesRef, usersRef } from './firebaseApp'

export default function startUpActions (store, router) {
  // run actions at the start of the App

  // read server data
  let serverData
  try {
    serverData = JSON.parse(window.cspot2_server_data)
  } catch (error) {
    console.log(error, 'No user is signed in. FROM: ', from)
  }
  if (serverData.plan) {
    store.dispatch('setSinglePlan', serverData.plan)
  }

  // check if a user is already logged on in the browser session
  var user = serverData.user
  if (user) {
    store.commit('setUser', user)
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
  }, 2000)

}
