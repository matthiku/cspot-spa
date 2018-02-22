/**
 * startUpActions is called from (imported into) the main.js module, and used in the Vue launch block.
 * 
 * (C) 2018 Matthias Kuhs
 *
 * @param {*} store   The Vuex store object as defined in main.js
 * @param {*} router  The Vue router object
 */
export default function startUpActions (store, router) {

  // read server data
  let serverData
  try {
    serverData = JSON.parse(window.cspot2_server_data)
  } catch (error) {
    console.log(error, 'No user is signed in.')
  }
  // check if page header contains single plan
  if (serverData.plan) {
    store.dispatch('setSinglePlan', serverData.plan)
    store.commit('addPlan', serverData.plan)
  }

  // check if a user is already logged on in the browser session
  var user = serverData.user
  if (user) {
    store.commit('setUser', user)
    setTimeout(() => {
      console.log('loadAllItems from startUpActions')
      store.dispatch('loadAllItems')
    }, 1000)

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

}
