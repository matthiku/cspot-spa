import firebase from 'firebase'

const config = {
  apiKey: 'AIzaSyDkBwk4y_0owfwnO5ojDvIYved6gOLzppc',
  authDomain: 'cspot-ify.firebaseapp.com',
  databaseURL: 'https://cspot-ify.firebaseio.com',
  projectId: 'cspot-ify',
  storageBucket: 'cspot-ify.appspot.com',
  messagingSenderId: '154842492597'
}

export const firebaseApp = firebase.initializeApp(config)

export const binRef = firebaseApp.database().ref().child('bin')
export const usersRef = firebaseApp.database().ref().child('users')
export const plansRef = firebaseApp.database().ref().child('plans')
export const songsRef = firebaseApp.database().ref().child('songs')
export const typesRef = firebaseApp.database().ref().child('types')
export const rolesRef = firebaseApp.database().ref().child('roles')
export const itemsRef = firebaseApp.database().ref().child('items')
