import axios from 'axios'

// import { songsRef } from '../../firebaseApp'

export default {
  state: {
    songs: 'loading',
    songPartsArray: 'loading',
    songParts: {},
    songsUpdatedAt: null
  },

  mutations: {
    setSongs(state, payload) {
      state.songs = payload
      // also write data into localStorage
      localStorage.setItem('songs', JSON.stringify(payload))
    },
    setSongsUpdateDate(state, payload) {
      state.songsUpdatedAt = payload
      // also write data into localStorage
      localStorage.setItem('songsUpdatedAt', payload)
    },
    setSongParts(state, payload) {
      state.songPartsArray = payload
      // also create an object with the codes as identifier
      payload.forEach(elem => (state.songParts[elem.code] = elem))
    }
  },

  actions: {
    refreshSongs({ state, commit, dispatch, getters }) {
      // Get the date of the latest update to the PLANS table
      // but send the local update date so that the backend can already send
      // all the date if we are outdated on the frontend...
      let frontendUpdateDate = getters.songsUpdatedAt
      axios
        .get(
          '/api/song/latest?latest=' +
            (frontendUpdateDate ? frontendUpdateDate : 'init')
        )
        .then(data => {
          let backendUpdateDate = data.data.date
          console.log('refreshSongs:', backendUpdateDate, frontendUpdateDate)
          if (!backendUpdateDate && (data.data instanceof Object)) {
            commit('setSongs', data.data)
            console.log('SONGS updated from backend')
            // now also get the latest SONGS updated date
            axios
              .get('/api/song/latest')
              .then(data => {
                commit('setSongsUpdateDate', data.data.date)
              })
              .catch(error => console.warn(error))
          } else if (backendUpdateDate && (state.songs instanceof Object) && Object.keys(state.songs).length) {
            commit('setSongsUpdateDate', backendUpdateDate)
            console.log('SONGS still up-to-date')
          } else {
            commit('setSongsUpdateDate', '')            
            console.log('not getting valid SONGS data from backend!', data);
            
          }
        })
        .catch(error => console.warn(error))
    },

    removeSong({ commit, dispatch }, payload) {
      commit('setLoading', true)
      // first, move the old song to the bin
      binRef
        .child('songs/' + payload.name)
        .set(payload)
        .then(() => {
          commit(
            'appendMessage',
            'song "' + payload.name + '" moved into the bin...'
          )
          songsRef
            .child(payload.id)
            .remove()
            .then(() => {
              commit(
                'appendMessage',
                'song "' + payload.name + '" removed and placed in the bin!'
              )
              commit('setLoading', false)
            })
            .catch(error => dispatch('errorHandling', error))
        })
        .catch(error => dispatch('errorHandling', error))
    },

    updateSong({ commit, dispatch }, payload) {
      commit('setLoading', true)
      const updateObj = {}
      updateObj[payload.field] = payload.value
      songsRef
        .child(payload.id)
        .update(updateObj)
        .then(() => {
          commit(
            'setMessage',
            'Field "' +
              payload.field +
              '" in this song was updated! Song key: ' +
              payload.id
          )
          commit('setLoading', false)
        })
        .catch(error => dispatch('errorHandling', error))
    },

    loadSongParts({ commit }) {
      axios
        .get('/api/song_part')
        .then(data => {
          if (data.data.forEach) {
            commit('setSongParts', data.data)
          } else {
            console.warn('loadSongParts: invalid response data', data)
          }
        })
        .catch(error => console.warn(error))
    }
  },

  getters: {
    songs(state) {
      if (localStorage.getItem('songs')) {
        let songs = JSON.parse(localStorage.getItem('songs'))
        // when the application is loaded, the Vuex store still empty
        // but now we can populate it from localStorage
        if (state.songs === 'loading') {
          console.log('SONGS: populating Vuex state from localStorage')
          state.songs = songs
        }
        if ((songs instanceof Object) && songs.length) return songs
      }
      return state.songs
    },
    songsUpdatedAt(state) {
      if (
        localStorage.getItem('songsUpdatedAt') &&
        localStorage.getItem('songs')
      ) {
        let dt = localStorage.getItem('songsUpdatedAt')
        // when the application is loaded, the Vuex store still empty
        // but now we can populate it from localStorage
        if (state.songsUpdatedAt === null) {
          state.songsUpdatedAt = dt
        }
        return dt
      }
      return state.songsUpdatedAt
    },
    songParts(state) {
      return state.songParts
    },
    songPartsArray(state) {
      return state.songPartsArray
    }
  }
}
