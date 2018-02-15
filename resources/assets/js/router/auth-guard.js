import { store } from '../store'

export default (to, from, next) => {
  // change title of the HTML document to the route name or meta tag
  document.title = store.getters.appName + ' - ' + (to.meta.title ? to.meta.title : to.name)

  // reset any old app messages
  store.dispatch('clearMessage')

  // check if user data was send in the header of the page
  var user
  try {
    user = JSON.parse(window.cspot2_server_data).user
  } catch (error) {
    console.log(error, 'No user is signed in. FROM: ', from)
  }
  if (user) {
    store.commit('setUser', user)
  }

  if (store.getters.user) {
    next()
  } else {
    console.log('no user found, routing to signin page')
    store.dispatch('setOldRoute', to)
    next('/signin')
  }
  
}
