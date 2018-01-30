import { store } from '../store'

export default (to, from, next) => {
  // change title of the HTML document to the route name or meta tag
  document.title = store.getters.appName + ' - ' + (to.meta.title ? to.meta.title : to.name)

  // reset any old app messages
  store.dispatch('clearMessage')

  if (store.getters.user) {
    next()
  } else {
    console.log('no user found, routing to signin page')
    store.dispatch('setOldRoute', to)
    next('/signin')
  }
}
