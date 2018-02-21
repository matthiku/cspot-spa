import axios from 'axios'
import * as moment from 'moment'

import bibleBooks from './bibleBooks.js'

export default {
  state: {
    plan: null,
    plans: 'loading',
    plansUpdatedAt: null,
    planUpdatedAt: null,
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

    addPlan (state, payload) {
      if (payload instanceof Object) {
        if (!(state.plans instanceof Object)) state.plans = []
        state.plans.push(payload)
      }
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
    },

    setPlansUpdateDate(state, payload) {
      state.plansUpdatedAt = payload
    },

    setPlanUpdateDate(state, payload) {
      state.planUpdatedAt = payload
    }

  },

  // A C T I O N S  (dispatches)
  actions: {
    refreshPlans ({state, commit, dispatch}, payload) {
      // first get date of latest update to PLANS table
      axios.get('/api/plan/latest')
      .then((data) => {
        let updateDate = data.data.date
        let oldDate = state.plansUpdatedAt
        commit('setPlansUpdateDate', updateDate)
        if (payload === 'init' || oldDate !== updateDate || !(state.plans instanceof Object)) {
          let reason = payload === 'init' ? payload : oldDate !== updateDate ? 'out-of-date' : 'object empty'
          console.log('updating local list of PLANS from Server, reason:', reason)
          axios.get('/api/plan')
          .then((data) => {
            commit('setPlans', data.data)
          })
          .catch((error) => console.warn(error))
        } else {
          console.log('PLANS still up-to-date')
        }
      })
      .catch((error) => console.warn(error))
    },

    // get complete data of a single plan
    reloadPlan ({state, commit, dispatch}, payload) {
      // first check if data was meanwhile updated on the backend
      axios.get(`/api/plan/${payload.planId}/latest`)
        .then((data) => {
          let updateDate = data.data.date
          let oldDate = state.planUpdatedAt
          commit('setPlanUpdateDate', updateDate)
          // only request a new copy from the backend if the data has changed
          if (oldDate !== updateDate || !(state.plan instanceof Object)) {
            axios.get(`/api/plan/${payload.planId}`)
            .then((data) => {
              // first 'empty' the plan in the store to make sure we do have just the updated plan!
              commit('setPlan', {})
              dispatch('setSinglePlan', data.data)
            })
            .catch((error) => console.warn(error))
        }
      })
    },

    // create a new Plan item and possibly upload an image file
    createPlan ({state, commit, dispatch}, payload) {
      let imageUrl
      let key
      // reach out to our DB and store it
      let planData = Object.assign({}, payload.planData)
      axios.post('/api/plan', planData)
        .then(data => {
          // the database call will get us an id, which we need to add a new plan to the store
          key = data.data.id
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
          commit('setPlan', planData)
          commit('setLoading', false)
          state.newPlanId = key
        })

        .catch((error) => console.warn(error))
    },

    // update an existing plan
    // - - payload contains planID, field name and field value
    updatePlan ({state, commit, dispatch}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      updateObj[payload.field] = payload.value
      axios.patch(`/api/plan/${payload.id}`, payload)
        .then((data) => {
          commit('setPlan', {})
          dispatch('setSinglePlan', data.data)
          commit('setMessage', 'Plan successfully updated.')
          commit('setLoading', false)
        })
        .catch((error) => dispatch('errorHandling', error))
    },

    // add a staff member to a plan
    // - - payload must contain plan id and staff object with userId and role name
    addStaffToPlan ({commit, dispatch}, payload) {
      commit('setLoading', true)
      axios.post(`/api/plan/${payload.planId}/team`, {
        'role_id': payload.roleId,
        'user_id': payload.userId
      })
        .then((data) => {
          dispatch('reloadPlan', payload)
          commit('appendMessage', `${payload.name} added as ${payload.role} to this plan`)
          commit('setLoading', false)
        })
        .catch((error) => dispatch('errorHandling', error))
    },

    // remove a staff member from a plan
    // - - payload must contain plan id and staff id
    removeStaffFromPlan ({commit, dispatch}, payload) {
      commit('setLoading', true)
      axios.delete(`/api/plan/${payload.planId}/team/${payload.staffId}`)
        .then((data) => {
          dispatch('reloadPlan', payload)
          commit('appendMessage', `${payload.name} removed as ${payload.role} from this plan`)
          commit('setLoading', false)
        })
        .catch((error) => dispatch('errorHandling', error))
    },

    addActionItemToPlan ({state, commit, dispatch}, payload) {
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
      axios.post(`/api/plan/${payload.planId}/item`, newObj)
        .then((data) => {
          dispatch('reloadPlan', payload)
          commit('appendMessage', '"' + payload.type + '" added to this plan')
          // dispatch('refreshPlans')
          commit('setLoading', false)
        })
        .catch((error) => dispatch('errorHandling', error))
    },

    updateActionItem ({rootState, commit, dispatch}, payload) {
      // payload must contain planId, itemId, field name and new value
      //
      let loadHandling = 'local'
      if (!rootState.shared.loading) {
        commit('setLoading', true)
      } else {
        loadHandling = 'remote'
      }
      const updateObj = {}
      updateObj[payload.field] = payload.newValue
      axios.patch(
        `/api/plan/${payload.planId}/item/${payload.actionId}`,
        {
          'field': payload.field,
          'value': payload.newValue
        }
      )
        .then((data) => {
          if (loadHandling === 'local') commit('setLoading', false)
          // update(replace) current plan and replace in the store!
          dispatch('reloadPlan', payload)
        })
        .catch((error) => dispatch('errorHandling', error))
    },

    // remove an action from a plan
    // - - payload must contain plan id and action id
    removeActionFromPlan ({state, commit, dispatch}, payload) {
      commit('setLoading', true)

      axios.delete(
        `/api/plan/${payload.planId}/item/${payload.actionId}`
      )
        .then((data) => {
          console.log('removing action from plan', payload)
          dispatch('reloadPlan', payload)
          commit('appendMessage', 'Action removed from this plan')
          // dispatch('refreshPlans')
          commit('setLoading', false)
        })
        .catch((error) => dispatch('errorHandling', error))
    },

    // move a plan to the bin
    // - - payload must be the full plan, as we send it to the bin and then delete it
    binPlan ({commit, dispatch}, payload) {
      commit('setLoading', true)
      axios.delete(`/api/plan/${payload.id}/soft`)
        .then(() => {
          dispatch('refreshPlans')
          commit('setLoading', false)
          commit('setMessage', 'Plan changed to hidden plan (private).')
        })
        .catch((error) => dispatch('errorHandling', error))
    },
    // delete a plan finally
    deletePlan ({state, commit, dispatch}, payload) {
      commit('setLoading', true)
      axios.delete(`/api/plan/${payload.id}`)
        .then(() => {
          dispatch('refreshPlans')
          commit('setLoading', false)
          commit('setMessage', 'Plan was erased.')
          state.plan = null
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
      // is this the same plan? Does it (still) exist in the PLANS array? 
      if (state.plan && state.plan.id && payload.id === state.plan.id) {
        // verify that plan still exists; e.g. wasn't deleted
        if (state.plans instanceof Object && !state.plans.find((pl) => payload.id === pl.id)) {
          state.plan = null
        }
        console.log('STORE - same plan!', payload.id, state.plan)
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
              if (action.comment && action.comment.indexOf(key) >= 0) isScriptureRef = true
            }
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
            obj.color = state.activityColours.song
            obj.icon = 'record_voice_over'
            obj.title = action.song_id
            obj.subtitle = action.song_id
            obj.book_ref = action.song_id
            if (songs[action.song_id]) {
              obj.title =  songs[action.song_id].title
              obj.subtitle = songs[action.song_id].title_2
              obj.book_ref = songs[action.song_id].book_ref
            }
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
      if (state.plans === 'loading') return 'loading'
      // return all plans ordered by date, descending
      return state.plans.sort((planA, planB) => {
        return moment(planB.date).unix() - moment(planA.date).unix()
      })
    },

    nextSunday (state) {
      if (!state.plans || state.plans === 'loading') return
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

    // return only future plans (ordered by date)
    futurePlans (state) {
      if (state.plans === 'loading') return 'loading'

      let plans = state.plans.filter(plan => {
        return moment(plan.date).isSameOrAfter(moment(), 'day')
      })
      return plans.sort((planA, planB) => {
        return moment(planA.date).unix() - moment(planB.date).unix()
      })
    },

    // return only plans on a certain day
    plansByDate (state) {
      return (date) => {
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
    planById (state) {
      return planId => {
        if (state.plans === 'loading') return 'loading'
        return state.plans.find(plan => {
          return plan.id === planId
        })
      }
    }
  }
}
