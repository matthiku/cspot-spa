import axios from 'axios'
import * as moment from 'moment'

export default {
  state: {
    plan: null,
    plans: 'loading',
    filteredPlans: [],
    plansUpdatedAt: null,
    planUpdatedAt: null,
    bibleBooks: null,
    bibleChapters: null,
    bibleVerses: null,
    scriptureRefs: {},
    activity: {
      colours: {
        song: 'indigo lighten-3',
        read: 'cyan lighten-3',
        text: 'lime darken-2'
      },
      icons: {
        song: 'record_voice_over',
        read: 'local_library',
        text: 'label'
      }
    }
  },

  // M U T A T I O N S  (commits)
  mutations: {
    setPlan(state, payload) {
      state.plan = payload
    },

    addPlan(state, payload) {
      if (payload instanceof Object) {
        if (!(state.plans instanceof Object)) state.plans = []
        state.plans.push(payload)
      }
    },

    setPlans(state, payload) {
      localStorage.setItem('plans', JSON.stringify(payload))
      state.plans = payload
    },

    setPlansUpdateDate(state, payload) {
      localStorage.setItem('plansUpdatedAt', payload)
      state.plansUpdatedAt = payload
    },

    setPlanUpdateDate(state, payload) {
      state.planUpdatedAt = payload
    },

    setFilteredPlans(state, payload) {
      state.filteredPlans = payload
    },

    setBibleBooks(state, payload) {
      state.bibleBooks = payload
      localStorage.setItem('bibleBooks', JSON.stringify(payload))
    },
    setBibleChapters(state, payload) {
      state.bibleChapters = payload
      localStorage.setItem('bibleChapters', JSON.stringify(payload))
    },
    setBibleVerses(state, payload) {
      state.bibleVerses = payload
      localStorage.setItem('bibleVerses', JSON.stringify(payload))
    },

    addScriptureRef(state, payload) {
      state.scriptureRefs[payload.label] = payload.text
    }
  },

  // A C T I O N S  (dispatches)
  actions: {
    loadBibleStructure({ state, commit, getters }) {
      // these are static tables, so no need to check for updates...
      if (!(getters.bibleBooks instanceof Array)) {
        axios.get('/api/bible/books').then(data => {
          commit('setBibleBooks', data.data)
        })
      }
      if (!(getters.bibleChapters instanceof Object)) {
        axios.get('/api/bible/books/all/chapters').then(data => {
          commit('setBibleChapters', data.data)
        })
      }
      if (!(getters.bibleVerses instanceof Object)) {
        axios.get('/api/bible/books/all/verses').then(data => {
          commit('setBibleVerses', data.data)
        })
      }
    },

    refreshPlans({ state, commit, dispatch, getters }) {
      // Get the date of the latest update to the PLANS table
      // but send the local update date so that the backend can already send
      // all the date if we are outdated on the frontend...
      let frontendUpdateDate = getters.plansUpdatedAt
      axios
        .get(
          '/api/plan/latest?latest=' +
            (frontendUpdateDate ? frontendUpdateDate : 'init')
        )
        .then(data => {
          let backendUpdateDate = data.data.date
          if (!backendUpdateDate && (data.data instanceof Array)) {
            commit('setPlans', data.data)
            console.log('PLANS updated from backend')
            // now also get the latest PLANS updated date
            axios
              .get('/api/plan/latest')
              .then(data => {
                commit('setPlansUpdateDate', data.data.date)
              })
              .catch(error => console.warn(error))
          } else if (backendUpdateDate && (state.plans instanceof Array) && state.plans.length) {
            commit('setPlansUpdateDate', backendUpdateDate)
          } else {
            commit('setPlansUpdateDate', '')
            console.log('not getting valid PLANS data from backend!', data);
          }
        })
        .catch(error => console.warn(error))
    },

    // get complete data of a single plan
    reloadPlan({ state, commit, dispatch }, payload) {
      /*
        first check if data was meanwhile updated on the backend
      */
      return new Promise((resolve, reject) => {
        axios.get(`/api/plan/${payload.planId}/latest`).then(data => {
          let updateDate = data.data.date
          let oldDate = state.planUpdatedAt
          // console.log('reloadPlan:', oldDate, updateDate)
          commit('setPlanUpdateDate', updateDate)
          /* 
            only request a new copy from the backend if the data has changed
          */
          if (oldDate !== updateDate || !(state.plan instanceof Object)) {
            axios
              .get(`/api/plan/${payload.planId}`)
              .then(data => {
                // first 'empty' the plan in the store to make sure we do have just the updated plan!
                commit('setPlan', {})
                dispatch('setSinglePlan', data.data)
                resolve()
              })
              .catch(error => {
                console.warn(error)
                reject()
              })
          }
        })
      })
    },

    // create a new Plan item and possibly upload an image file
    createPlan({ state, commit, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        let imageUrl, key
        let planData = Object.assign({}, payload.planData)
        axios
          .post('/api/plan', planData)
          .then(data => {
            // the database call will get us an id, which we need to add a new plan to the store
            key = data.data.id
            planData = data.data
            return key
          })
          // now check if there is a file to be uploaded
          .then(key => {
            if (payload.image) {
              const filename = payload.image.name
              const ext = filename.slice(filename.lastIndexOf('.'))
              return firebaseApp
                .storage()
                .ref('plans/' + key + ext)
                .put(payload.image)
            }
          })
          // if applicable, write the newly uploaded image ULR to the plan data
          .then(fileData => {
            if (fileData) {
              imageUrl = fileData.metadata.downloadURLs[0]
              return plansRef.child(key).update({ imageUrl: imageUrl })
            }
          })
          // now write the complete plan data to the local plan list
          .then(() => {
            Object.assign(planData, {
              id: key,
              imageUrl: imageUrl
            })
            commit('setPlan', {}) // prepare plan data for the view
            dispatch('setSinglePlan', planData)
            dispatch('refreshPlans', 'init') // also force a PLANS reload
            commit('setLoading', false)
            resolve(planData)
          })
          .catch(error => {
            console.warn(error)
            reject()
          })
      })
    },

    // update an existing plan
    // - - payload contains planID, field name and field value
    updatePlan({ state, commit, dispatch }, payload) {
      commit('setLoading', true)
      const updateObj = {}
      updateObj[payload.field] = payload.value
      axios
        .patch(`/api/plan/${payload.id}`, payload)
        .then(data => {
          commit('setPlan', {})
          dispatch('setSinglePlan', data.data)
          dispatch('refreshPlans', 'init') // make sure the plans list will be updated also
          commit('setMessage', 'Plan successfully updated.')
          commit('setLoading', false)
        })
        .catch(error => dispatch('errorHandling', error))
    },

    // add a staff member to a plan
    // - - payload must contain plan id and staff object with userId and role name
    addStaffToPlan({ commit, dispatch }, payload) {
      commit('setLoading', true)
      axios
        .post(`/api/plan/${payload.planId}/team`, {
          role_id: payload.roleId,
          user_id: payload.userId
        })
        .then(data => {
          dispatch('reloadPlan', payload)
          commit(
            'appendMessage',
            `${payload.name} added as ${payload.role} to this plan`
          )
          dispatch('refreshPlans', 'init') // make sure the plans list will be updated also
          commit('setLoading', false)
        })
        .catch(error => dispatch('errorHandling', error))
    },

    // remove a staff member from a plan
    // - - payload must contain plan id and staff id
    removeStaffFromPlan({ commit, dispatch }, payload) {
      commit('setLoading', true)
      axios
        .delete(`/api/plan/${payload.planId}/team/${payload.staffId}`)
        .then(data => {
          dispatch('reloadPlan', payload)
          commit(
            'appendMessage',
            `${payload.name} removed as ${payload.role} from this plan`
          )
          dispatch('refreshPlans', 'init') // make sure the plans list will be updated also
          commit('setLoading', false)
        })
        .catch(error => dispatch('errorHandling', error))
    },

    addActionItemToPlan({ state, commit, dispatch }, payload) {
      if (!payload.planId) {
        dispatch(
          'errorHandling',
          'Error when trying to add action item: planId missing!'
        )
        return
      }
      if (!payload.type) {
        dispatch(
          'errorHandling',
          'Error when trying to add action item: action type missing!'
        )
        return
      }
      if (isNaN(parseInt(payload.seqNo))) {
        dispatch(
          'errorHandling',
          'Error when trying to add action item: seqNo missing!'
        )
        return
      }
      return new Promise((resolve, reject) => {
        const newObj = {
          value: payload.value,
          type: payload.type,
          seqNo: payload.seqNo
        }
        axios.post(`/api/plan/${payload.planId}/item`, newObj).then(data => {
          commit('appendMessage', '"' + payload.type + '" added to this plan')
          dispatch('refreshPlans', 'init') // make sure the plans list will be updated also
          dispatch('reloadPlan', payload).then(() => {
            commit('setLoading', false)
            resolve(data) // only resolve once the plan has been reloaded from the backend
          })
        })
      })
    },

    updateActionItem({ rootState, commit, dispatch }, payload) {
      // payload must contain planId, actionId, field name and newValue
      //
      let loadHandling = 'local'
      if (!rootState.shared.loading) {
        commit('setLoading', true)
      } else {
        loadHandling = 'remote'
      }
      const updateObj = {}
      updateObj[payload.field] = payload.newValue
      axios
        .patch(`/api/plan/${payload.planId}/item/${payload.actionId}`, {
          field: payload.field,
          value: payload.newValue
        })
        .then(data => {
          if (loadHandling === 'local') commit('setLoading', false)
          // update(replace) current plan and replace in the store!
          dispatch('reloadPlan', payload)
        })
        .catch(error => dispatch('errorHandling', error))
    },

    // remove an action from a plan
    // - - payload must contain plan id and action id
    removeActionFromPlan({ state, commit, dispatch }, payload) {
      commit('setLoading', true)

      axios
        .delete(`/api/plan/${payload.planId}/item/${payload.actionId}`)
        .then(data => {
          // console.log('removing action from plan', payload)
          dispatch('reloadPlan', payload)
          commit('appendMessage', 'Action removed from this plan')
          dispatch('refreshPlans', 'init') // make sure the plans list will be updated also
          commit('setLoading', false)
        })
        .catch(error => dispatch('errorHandling', error))
    },

    // move a plan to the bin
    // - - payload must be the full plan, as we send it to the bin and then delete it
    binPlan({ commit, dispatch }, payload) {
      commit('setLoading', true)
      axios
        .delete(`/api/plan/${payload.id}/soft`)
        .then(() => {
          dispatch('refreshPlans', 'init') // make sure the plans list will be updated also
          commit('setLoading', false)
          commit('setMessage', 'Plan changed to hidden plan (private).')
        })
        .catch(error => dispatch('errorHandling', error))
    },
    // delete a plan finally
    deletePlan({ state, commit, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios
          .delete(`/api/plan/${payload.id}`)
          .then(() => {
            dispatch('refreshPlans', 'init') // force a PLANS reload
            commit('setPlan', {})
            commit('setMessage', 'Plan was erased.')
            commit('setLoading', false)
            resolve()
          })
          .catch(error => {
            dispatch('errorHandling', error)
            reject()
          })
      })
    },

    setSinglePlan({ rootState, state, commit, dispatch }, payload) {
      if (typeof payload !== 'object') {
        console.warn('STORE - payload is not an object!', payload)
        return
      }
      if (!payload.hasOwnProperty('id')) {
        console.warn('STORE - payload missing ID!', payload)
        return
      }
      // is this the same plan? Does it (still) exist in the PLANS array?
      if (state.plan && state.plan.id && payload.id === state.plan.id) {
        // verify that plan still exists; e.g. wasn't deleted
        if (
          state.plans instanceof Object &&
          !state.plans.find(pl => payload.id === pl.id)
        ) {
          state.plan = null
        }
        console.log('STORE - same plan!', payload.id, state.plan)
        return
      }
      /*
        add plan activities list property
      */
      let actionList = []
      let planItems = payload.items
      let songs = rootState.song.songs
      for (let key in planItems) {
        if (planItems.hasOwnProperty(key)) {
          let action = planItems[key]
          // check if comment contains a bible ref
          let isScriptureRef = false
          if (state.bibleBooks && state.bibleBooks.forEach) {
            state.bibleBooks.forEach(book => {
              if (action.comment && action.comment.indexOf(book) >= 0) {
                isScriptureRef = true
              }
            })
          }
          let obj = {
            seqNo: parseInt(action.seq_no),
            key: action.id,
            value: 0,
            warning: false,
            forLeadersEyesOnly: action.forLeadersEyesOnly
          }
          if (action.song_id) {
            obj.type = 'song'
            obj.value = action.song_id
            obj.title = action.song_id
            if (songs[action.song_id]) {
              obj.title = songs[action.song_id].title
              obj.lyrics = songs[action.song_id].lyrics
              obj.chords = songs[action.song_id].chords
              obj.onsongs = onsongsObject(songs[action.song_id].onsongs)
              obj.sequence = songs[action.song_id].sequence
              obj.subtitle = songs[action.song_id].title_2
              obj.book_ref = songs[action.song_id].book_ref
            }
          } else if (action.comment && isScriptureRef) {
            obj.type = 'read'
            obj.title = action.comment
            let arBref = action.comment.split(';')
            arBref.forEach(bRef => {
              dispatch('getScriptureRef', bRef)
            })
          } else {
            obj.type = 'text'
            obj.title = action.comment
            obj.showTitle = action.show_comment
          }
          // assign the proper icon and colour depending on type
          obj.color = state.activity.colours[obj.type]
          obj.icon = state.activity.icons[obj.type]

          // add the finished object to the array
          actionList.push(obj)
        }
      }
      payload.actionList = actionList.sort(
        (elemA, elemB) => elemA.seqNo - elemB.seqNo
      )

      // now write everyting to the state
      commit('setPlan', payload)
    },

    getScriptureRef({ state, commit }, payload) {
      let bRef = splitBref(payload)
      // make sure the striong contains a valid bible ref
      if (
        bRef.version === undefined ||
        state.bibleBooks.indexOf(bRef.book) < 0
      )
        return
      axios
        .get(
          `/api/bible/passage/${bRef.version}/${bRef.book}/${bRef.chapter}/${
            bRef.verse_from
          }/${bRef.verse_to}`
        )
        .then(data => {
          let block = data.data
          if (data.data.forEach) {
            block = ''
            data.data.forEach(
              verse => (block += `(${verse.verse}) ${verse.text}\n`)
            )
          }
          commit('addScriptureRef', { label: payload, text: block })
        })
    }
  },

  // G E T T E R S
  getters: {
    newPlanId(state) {
      return state.newPlanId
    },

    plans(state) {
      if (localStorage.getItem('plans')) {
        let plans = JSON.parse(localStorage.getItem('plans'))
        if ((plans instanceof Array) && plans.length) {
          console.log('supplying PLANS list from localStorage!')
          state.plans = plans
        }
      }
      if (state.plans === 'loading' || !(state.plans instanceof Array)) return 'loading'
      // return all plans ordered by date, descending
      return state.plans.sort((planA, planB) => {
        return moment(planB.date).unix() - moment(planA.date).unix()
      })
    },

    plansUpdatedAt(state) {
      if (
        localStorage.getItem('plansUpdatedAt') &&
        localStorage.getItem('plans')
      ) {
        let dt = localStorage.getItem('plansUpdatedAt')
        // when the application is loaded, the Vuex store still empty
        // but now we can populate it from localStorage
        if (state.plansUpdatedAt === null) {
          state.plansUpdatedAt = dt
        }
        return dt
      }
      return state.plansUpdatedAt
    },

    filteredPlans(state) {
      return state.filteredPlans
    },

    nextSunday(state) {
      if (!state.plans || state.plans === 'loading' || !(state.plans instanceof Array)) return
      let nextSunday = moment()
        .isoWeekday(7)
        .startOf('day')

      // find the plan with type_id 1 or 2 for next Sunday
      let plan = state.plans.find(plan => {
        let isNextSunday = moment(plan.date)
          .startOf('day')
          .isSame(nextSunday, 'day')
        // isNextSunday && (plan.type_id === 0 || plan.type_id === 1)
        return isNextSunday && [0, 1].indexOf(parseInt(plan.type_id)) >= 0
      })
      if (!plan) return {}
      return plan
    },

    // return only future plans (ordered by date)
    futurePlans(state) {
      if (state.plans === 'loading') return 'loading'

      let plans = state.plans.filter(plan => {
        return moment(plan.date).isSameOrAfter(moment(), 'day')
      })
      return plans.sort((planA, planB) => {
        return moment(planA.date).unix() - moment(planB.date).unix()
      })
    },

    // return only plans on a certain day
    plansByDate(state) {
      return date => {
        if (state.plans === 'loading') return 'loading'
        if (!date) return 'date missing'

        let plans = state.plans.filter(plan => {
          return moment(plan.date).isSame(moment(date), 'day')
        })
        return plans.sort((planA, planB) => {
          return moment(planA.date).unix() - moment(planB.date).unix()
        })
      }
    },

    // return a plan when a proper planId was given as an argument
    planById(state) {
      return planId => {
        if (state.plans === 'loading') return 'loading'
        return state.plans.find(plan => {
          return plan.id === planId
        })
      }
    },

    bibleBooks(state) {
      let ls = localStorage.getItem('bibleBooks')
      if (ls) {
        state.bibleBooks = JSON.parse(ls)
      }
      return state.bibleBooks
    },
    bibleChapters(state) {
      let ls = localStorage.getItem('bibleChapters')
      if (ls) {
        state.bibleChapters = JSON.parse(ls)
      }
      return state.bibleChapters
    },
    bibleVerses(state) {
      let ls = localStorage.getItem('bibleVerses')
      if (ls) {
        state.bibleVerses = JSON.parse(ls)
      }
      return state.bibleVerses
    }
  }
}

// HELPER functions

/**
 * Create an object from the array of onsong parts
 *
 * Note: the server only provides an array of objects.
 * Each onSong object contains an id indicating the type.
 * This method simply creates a single object
 * containing all onsong objects, with the type as index.
 */
function onsongsObject(arr) {
  if (!arr || !arr.length) {
    return
  }
  let obj = {}
  arr.forEach(elem => {
    obj[elem.song_part_id] = elem
  })
  return obj
}

/** 
  Split a bible reference string into an object

  @param string text Scripture reference in the format "[book] [chapter]{:[verse_from]:[verse_to]} ([version])"

  @return object {
      version:    [version],
      book:       [book],
      chapter:    [chapter],
      verse_from: [verse_from],
      verse_from: [verse_from]
    }
*/
function splitBref(text) {
  if (!text) {
    return
  }

  let ref = text.split(' ')
  let obj = {},
    nr = 0,
    book
  // check if book name starts with a number
  if (!isNaN(ref[0])) {
    book = ref[nr++] + ' ' + ref[nr++]
  } else if (text.substr(1, 1) == '_') {
    book = ref[nr++].replace('_', ' ')
  } else {
    book = ref[nr++]
  }
  obj.book = book.trim()

  // detect chapter and verse
  var chve = ref[nr++].split(':')
  obj.chapter = chve[0]
  // is there a verse reference?
  if (chve.length > 1) {
    // detect verse_from and verse_to
    var vrs = chve[1].split('-')
    obj.verse_from = vrs[0]
    // analyze verse_to
    if (vrs.length > 1) {
      // there could be another reference being attached...
      var vto = vrs[1].split(/[,;]/)
      obj.verse_to = vto[0]
    }
    if (obj.verse_to === undefined) obj.verse_to = obj.verse_from
  } else {
    // no verse references detected, use generic values
    obj.verse_from = 0
    obj.verse_to = 199
  }

  // name of the bible VERSION (without brackets!)
  obj.version = ref[nr]
  if (obj.version) obj.version = obj.version.replace(/(\(|\))/g, '')

  // problem with differing naming conventions for Psalm in NIV vs others
  if (obj.book == 'Psalms') obj.book = 'Psalm'
  return obj
}
