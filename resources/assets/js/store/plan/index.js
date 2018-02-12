import axios from 'axios'
import * as moment from 'moment'

import bibleBooks from './bibleBooks.js'

export default {
  state: {
    plan: null,
    plans: [],
    bibleBooks,
    newPlanId: null,
    activityColours: {
      song: 'indigo lighten-3',
      read: 'cyan lighten-3',
      text: 'lime darken-2'
    }
  },

  // M U T A T I O N S  (commits)
  mutations: {

    setPlan (state, payload) {
      state.plan = payload
    },

    setPlans (state, payload) {
      state.plans = payload
    },

    createPlan (state, payload) {
      // state.plans.push(payload) // not needed, as we get an update through firebase!
      state.newPlanId = payload.id
    },

    clearNewPlanId (state) {
      state.newPlanId = null
    }

  },

  // A C T I O N S  (dispatches)
  actions: {
    refreshPlans ({commit, dispatch}, payload) {
      console.log('updating local list of PLANS from Server')
      axios.get('/api/plan')
        .then((data) => {
          commit('setPlans', data.data)
        })
        .catch((error) => dispatch('errorHandling', error))
    },

    // create a new Plan item and possibly upload an image file
    createPlan ({commit, dispatch}, payload) {
      let imageUrl
      let key
      // reach out to our DB and store it
      let planData = Object.assign({}, payload.planData)
      plansRef.push(planData)
        .then(data => {
          // the database call will get us an id, which we need to add a new plan to the store
          key = data.key
          return key
        })
        // now check if there is a file to be uploaded
        .then((key) => {
          if (payload.image) {
            const filename = payload.image.name
            const ext = filename.slice(filename.lastIndexOf('.'))
            return firebaseApp.storage().ref('plans/' + key + ext).put(payload.image)
          }
        })
        // if applicable, write the newly uploaded image ULR to the plan data
        .then((fileData) => {
          if (fileData) {
            imageUrl = fileData.metadata.downloadURLs[0]
            return plansRef.child(key).update({imageUrl: imageUrl})
          }
        })
        // now write the complete plan data to the local plan list
        .then(() => {
          Object.assign(
            planData, {
              id: key,
              imageUrl: imageUrl
            })
          commit('createPlan', planData)
          commit('setLoading', false)
        })

        .catch(error => dispatch('errorHandling', error))
    },

    // update an existing plan
    // - - payload contains planID, field name and field value
    updatePlan ({state, commit, dispatch}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      updateObj[payload.field] = payload.value
      plansRef.child(payload.id).update(updateObj)
        .then(() => {
          commit('setLoading', false)
          dispatch('refreshPlans')
          commit('setMessage', 'Plan successfully updated.')
        })
        .catch((error) => dispatch('errorHandling', error))
    },
    // add a staff member to a plan
    // - - payload must contain plan id and staff object with userId and role name
    addStaffToPlan ({commit, dispatch}, payload) {
      commit('setLoading', true)
      plansRef.child(payload.planId).child('staff').push(payload.staff)
        .then(() => {
          commit('appendMessage', 'One person added to this plan')
          commit('setLoading', false)
        })
        .catch((error) => dispatch('errorHandling', error))
    },
    // remove a staff member from a plan
    // - - payload must contain plan id and staff id
    removeStaffFromPlan ({commit, dispatch}, payload) {
      commit('setLoading', true)
      plansRef.child(payload.planId).child('staff').child(payload.staffId).remove()
        .then(() => {
          commit('appendMessage', 'One person removed from this plan')
          commit('setLoading', false)
        })
        .catch((error) => dispatch('errorHandling', error))
    },

    addActionItemToPlan ({commit, dispatch}, payload) {
      if (!payload.planId) {
        dispatch('errorHandling', 'Error when trying to add action item: planId missing!')
        return
      }
      if (!payload.type) {
        dispatch('errorHandling', 'Error when trying to add action item: action type missing!')
        return
      }
      if (isNaN(parseInt(payload.seqNo))) {
        dispatch('errorHandling', 'Error when trying to add action item: seqNo missing!')
        return
      }
      commit('setLoading', true)
      const newObj = {
        value: payload.value,
        type: payload.type,
        seqNo: payload.seqNo
      }
      plansRef
        .child(payload.planId)
        .child('actions')
        .push(newObj)
        .then(() => {
          commit('appendMessage', '"' + payload.type + '" item added to this plan')
          dispatch('refreshPlans')
          commit('setLoading', false)
        })
        .catch((error) => dispatch('errorHandling', error))
    },
    updateActionItem ({rootState, commit, dispatch}, payload) {
      let loadHandling = 'local'
      if (!rootState.shared.loading) {
        commit('setLoading', true)
      } else {
        loadHandling = 'remote'
      }
      const updateObj = {}
      updateObj[payload.field] = payload.newValue
      plansRef
        .child(payload.planId)
          .child('actions')
            .child(payload.key)
              .update(updateObj)
                .then(() => { if (loadHandling === 'local') commit('setLoading', false) })
                .catch((error) => dispatch('errorHandling', error))
    },
    // remove an action from a plan
    // - - payload must contain plan id and action id
    removeActionFromPlan ({commit, dispatch}, payload) {
      commit('setLoading', true)
      plansRef.child(payload.planId).child('actions').child(payload.actionId).remove()
        .then(() => {
          commit('appendMessage', 'Action removed from this plan')
          dispatch('refreshPlans')
          commit('setLoading', false)
        })
        .catch((error) => dispatch('errorHandling', error))
    },

    // move a plan to the bin
    // - - payload must be the full plan, as we send it to the bin and then delete it
    binPlan ({state, commit, dispatch}, payload) {
      commit('setLoading', true)
      binRef.child('users').push(payload)
      .then(() => {
        plansRef.child(payload.id).remove()
        .then(() => {
          dispatch('refreshPlans')
          commit('setLoading', false)
          commit('setMessage', 'Plan removed into the bin.')
        })
        .catch((error) => dispatch('errorHandling', error))
      })
    },

    // delete a plan finally
    deletePlan ({state, commit, dispatch}, payload) {
      commit('setLoading', true)
      plansRef.child(payload.id).remove()
        .then(() => {
          dispatch('refreshPlans')
          commit('setLoading', false)
          commit('setMessage', 'Plan was erased.')
        })
        .catch((error) => dispatch('errorHandling', error))
    },
    clearNewPlanId ({commit}) {
      commit('clearNewPlanId')
    },

    setSinglePlan({state, commit, rootState}, payload) {
      if (typeof(payload) !== 'object') {
        console.warn('STORE - payload is not an object!', payload)
        return
      }
      if (!payload.hasOwnProperty('id')) {
        console.warn('STORE - payload missing ID!', payload)
        return
      }

      // is this the same plan?
      if (state.plan && payload.id === state.plan.id) {
        console.log('STORE - same plan!', payload.id)
        return
      }

      // add plan activities list property
      let actionList = []
      let planItems = payload.items
      let songs = rootState.song.songs
      for (let key in planItems) {
        if (planItems.hasOwnProperty(key)) {
          let action = planItems[key]
          let isScriptureRef = false
          let bb = state.bibleBooks
          for (const key in bb) {
            if (bb.hasOwnProperty(key)) {
              if (action.comment.indexOf(key) >= 0) isScriptureRef = true
            }
          }
          let obj = {
            seqNo: parseInt(action.seq_no),
            key: action.id,
            value: 0,
            warning: false
          }
          if (action.song_id) {
            obj.type = 'song'
            obj.value = action.song_id
            obj.color = state.activityColours.song
            obj.icon = 'record_voice_over'
            obj.title = songs[action.song_id] ? songs[action.song_id].title : action.song_id
            obj.book_ref = songs[action.song_id] ? songs[action.song_id].book_ref : action.song_id
          } else if (action.comment && isScriptureRef) {
            obj.type = 'read'
            obj.title = action.comment
            obj.color = 'cyan lighten-3'
            obj.icon = 'local_library'
          } else {
            obj.type = 'text'
            obj.title = action.comment
            obj.color = 'lime darken-2'
            obj.icon = 'label'
          }
          actionList.push(obj)
        }
      }
      payload.actionList = actionList.sort((elemA, elemB) => elemA.seqNo - elemB.seqNo)

      // now write everyting to the state
      commit('setPlan', payload)
    }
  },

  // G E T T E R S
  getters: {

    bibleBooksList (state) {
      if (state.bibleBooks === '') return []
      let bb = state.bibleBooks
      let bibleBooks = []
      for (const key in bb) {
        if (bb.hasOwnProperty(key)) {
          // const element = bb[key]
          bibleBooks.push(key)
        }
      }
      return bibleBooks
      // return state.bibleBooks.sort((bookA, bookB) => {
      //   console.log(bookA.id < bookB.id, bookA.name, bookB.name)
      //   return bookA.id > bookB.id
      // })
    },

    newPlanId (state) {
      return state.newPlanId
    },

    plans (state) {
      // return all plans ordered by date, descending
      return state.plans.sort((planA, planB) => {
        return moment(planB.date).unix() - moment(planA.date).unix()
      })
    },

    nextSunday (state) {
      if (!state.plans) return
      let nextSunday = moment().isoWeekday(7).startOf('day')
      
      // find the plan with type_id 1 or 2 for next Sunday
      let plan = state.plans.find(plan => {
        let isNextSunday = moment(plan.date).startOf('day').isSame(nextSunday, 'day')
        // isNextSunday && (plan.type_id === 0 || plan.type_id === 1)
        return isNextSunday && [0, 1].indexOf(parseInt(plan.type_id)) >= 0
      })
      if (!plan) return {}
      return plan
    },

    futurePlans (state, getters) {
      // return only future plans (ordered by date)
      let plans = getters.plans.filter(plan => {
        return moment(plan.date).isSameOrAfter(moment(), 'day')
      })
      return plans.sort((planA, planB) => {
        return moment(planA.date).unix() - moment(planB.date).unix()
      })
    },

    // return a plan when a proper planId was given as an argument
    planById (state) {
      return planId => {
        return state.plans.find(plan => {
          return plan.id === planId
        })
      }
    }
  }
}
