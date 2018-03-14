import { store } from '../store'

export default (to, from, next) => {
  // indicate that we are loading a new component
  store.commit('setRouteChanging', true)
  // console.log(new Date().getMilliseconds(), 'route change started')

  // change title of the HTML document to the route name or meta tag
  document.title =
    store.getters.appName + ' - ' + (to.meta.title ? to.meta.title : to.name)

  // reset any old app messages
  store.dispatch('clearMessage')

  // check if user data was send in the header of the page
  var dt
  try {
    dt = JSON.parse(window.cspot2_server_data)
  } catch (error) {
    console.log(error, 'No user is signed in. FROM: ', from)
  }
  var user
  if (dt) user = dt.user || null
  if (user) {
    store.commit('setUser', user)
  }

  if (store.getters.user) {
    next()
  } else {
    console.log('no user found, routing to signin page')
    next('/signin')
  }
}
