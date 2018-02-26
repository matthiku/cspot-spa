import axios from 'axios'

// import { songsRef } from '../../firebaseApp'

export default {
  state: {
    songs: 'loading',
    songsUpdatedAt: null
  },

  mutations: {
    setSongs(state, payload) {
      state.songs = payload
    },
    addDummySong(state, payload) {
      state.songs[payload.id] = payload
    },
    setSongsUpdateDate(state, payload) {
      state.songsUpdatedAt = payload
    }
  },

  actions: {
    refreshSongs({ state, commit, dispatch }, payload) {
      // first get date of latest update to SONGS table
      axios
        .get('/api/song/latest')
        .then(data => {
          let updateDate = data.data.date
          let oldDate = state.songsUpdatedAt
          // console.log('setSongsUpdateDate', updateDate)
          commit('setSongsUpdateDate', updateDate)

          if (
            (
              payload === 'init' ||
              oldDate !== updateDate ||
              !(state.songs instanceof Object) ||
              state.songs instanceof Array
            ) &&
            updateDate !== undefined
          ) {
            let reason =
              payload === 'init'
                ? payload
                : oldDate !== updateDate ? 'out-of-date' : 'object empty'
            console.log(
              'updating local list of SONGS from Server, reason:',
              reason
            )
            if (reason === 'out-of-date') {
              console.log(oldDate, updateDate)
            }
            if (reason === 'object empt') {
              console.log(state.songs)
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
                  console.warn(data)
                }
              })
              .catch(error => console.warn(error))
          } else if (updateDate === undefined) {
            console.warn('could not get SONGS update date!')
          }
        })
        .catch(error => console.warn(error))
    },

    addDummySong({ commit }, payload) {
      // adding a local-only dummy plan TYPE before it get's its proper name
      commit('addDummySong', payload)
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
    }
  },

  getters: {
    songs(state) {
      return state.songs
    }
  }
}
