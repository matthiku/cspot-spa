import axios from 'axios'

// import { songsRef } from '../../firebaseApp'

export default {
  state: {
    songs: []
  },

  mutations: {
    setSongs (state, payload) {
      state.songs = payload
    },
    addDummySong (state, payload) {
      state.songs[payload.id] = payload
    }
  },

  actions: {
    refreshSongs ({commit, dispatch}, payload) {
      console.log('updating local list of SONGS from Server')
      axios.get('/api/song')
        .then(data => {
          if (data.data) {
            let songs = {}
            // turn array into an object
            data.data.forEach(elem => {
              let obj = elem
              songs[obj.id] = elem
            })
            commit('setSongs', songs)
          }
        })
        .catch(error => dispatch('errorHandling', error))
    },

    addDummySong ({commit}, payload) {
      // adding a local-only dummy plan TYPE before it get's its proper name
      commit('addDummySong', payload)
    },

    removeSong ({commit, dispatch}, payload) {
      commit('setLoading', true)
      // first, move the old song to the bin
      binRef.child('songs/' + payload.name).set(payload)
        .then(() => {
          commit('appendMessage', 'song "' + payload.name + '" moved into the bin...')
          songsRef.child(payload.id).remove()
          .then(() => {
            commit('appendMessage', 'song "' + payload.name + '" removed and placed in the bin!')
            commit('setLoading', false)
          })
          .catch((error) => dispatch('errorHandling', error))
        })
        .catch((error) => dispatch('errorHandling', error))
    },

    updateSong ({commit, dispatch}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      updateObj[payload.field] = payload.value
      songsRef
        .child(payload.id)
        .update(updateObj)
        .then(() => {
          commit('setMessage', 'Field "' + payload.field + '" in this song was updated! Song key: ' + payload.id)
          commit('setLoading', false)
        })
        .catch(error => dispatch('errorHandling', error))
    }
  },

  getters: {
    songs (state) {
      return state.songs
    }
  }
}
