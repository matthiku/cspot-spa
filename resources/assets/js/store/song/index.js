import { songsRef, binRef } from '../../firebaseApp'

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
    refreshSongs ({commit, dispatch}) {
      console.log('updating local list of SONGS with full one-off snapshot from Server')
      songsRef
        .once('value')
        .then(data => {
          dispatch('loadSongs', data)
        })
        .catch(error => dispatch('errorHandling', error))
    },

    // load existing songs from the DB
    loadSongs ({commit}, payload) {
      let songs = []
      // payload is a firebase data snapshot, we add the 'key' as identifier to the dataset
      payload.forEach(song => {
        let item = song.val()
        item.key = song.key
        songs.push(item)
      })
      commit('setLoading', false)
      commit('setSongs', songs)
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
