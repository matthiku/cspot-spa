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
    setSongParts (state, payload) {
      state.songPartsArray = payload
      // also create an object with the codes as identifier
      payload.forEach(elem => state.songParts[elem.code] = elem)
    }
  },

  actions: {
    refreshSongs({ state, commit, dispatch, getters }, payload) {
      // first get date of latest update to SONGS table
      axios
        .get('/api/song/latest')
        .then(data => {
          let backendUpdateDate = data.data.date
          let frontendUpdateDate = getters.songsUpdatedAt
          // console.log('refreshSongs', backendUpdateDate, frontendUpdateDate)
          if (frontendUpdateDate === backendUpdateDate && getters.songs instanceof Object) return
          if (backendUpdateDate !== undefined) {            
            commit('setSongsUpdateDate', backendUpdateDate)
          }
          /*
            load SONGS from back end and write into LocalStorage and local Vuex store
          */
          if (
            (payload === 'init' ||
              !(state.songs instanceof Object) ||
              state.songs instanceof Array) &&
            backendUpdateDate !== undefined
          ) {
            let reason =
              payload === 'init'
                ? payload
                : frontendUpdateDate !== backendUpdateDate ? 'out-of-date' : 'object empty'
            console.log(
              'updating local list of SONGS from Server, reason:',
              reason
            )
            if (reason === 'out-of-date') {
              console.log(reason, frontendUpdateDate, backendUpdateDate)
            }
            if (reason === 'object empty') {
              console.log(reason, state.songs)
            }
            axios
              .get('/api/song')
              .then(data => {
                if (data.data.forEach) {
                  let songs = {}
                  // turn array into an object
                  data.data.forEach(elem => {
                    let obj = elem
                    songs[obj.id] = elem
                  })
                  commit('setSongs', songs)
                } else {
                  console.warn('refreshSongs: Invalid response', data)
                }
              })
              .catch(error => console.warn(error))
          } else if (backendUpdateDate === undefined) {
            console.warn('refreshSongs: could not get SONGS last update date!')
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

    loadSongParts ({commit}) {
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
    songs (state) {
      if (localStorage.getItem('songs')) {
        let songs = JSON.parse(localStorage.getItem('songs'))
        // when the application is loaded, the Vuex store still empty
        // but now we can populate it from localStorage
        if (state.songs === 'loading') {
          console.log('SONGS: populating Vuex state from localStorage')
          state.songs = songs
        }
        return songs
      }
      return state.songs
    },
    songsUpdatedAt (state) {
      if (localStorage.getItem('songsUpdatedAt')) {
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
    songParts (state) {
      return state.songParts
    }
  }
}
