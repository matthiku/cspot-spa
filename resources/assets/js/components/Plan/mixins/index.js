export default {
  data () {
    return {
      activityColours: {
        song: 'indigo lighten-3',
        read: 'cyan lighten-3',
        text: 'lime darken-2'
      }
    }
  },

  computed: {
    types () {
      return this.$store.getters.types
    },
    songs () {
      return this.$store.getters.songs
    },
    plans () {
      return this.$store.getters.plans
    },
    plan() {
      return this.$store.state.plan.plan
    },
    bibleBooks () {
      return this.$store.state.plan.bibleBooks
    },
    bibleBooksList () {
      return this.$store.getters.bibleBooksList
    }
  },

  methods: {
    userOwnsPlan (plan) {
      if (!plan) return false

      // get plan from store and investigate the roles
      let user = this.$store.getters.user
      let check = false
      for (let rl in plan.staff) {
        let role = plan.staff[rl]
        if (role.userId === user.id) check = true
      }
      // an admin is always owner
      return this.$store.getters.userIsAdmin || check
    },

    findRoleInStaff (requestedRole, staff) {
      if (!staff) return null
      // loop through the staff list (an object) and find the requested role
      let user = { name: 'pending', id: null }
      Object.entries(staff).forEach(
        ([key, role]) => {
          if (role.role === requestedRole) user.id = role.userId
        }
      )
      return (this.users && user.id && this.users[user.id]) ? this.users[user.id] : user
    },

    createPlanActionsList() {
      if (!this.plans || !this.plan || !this.plan.id) return

      let actionList = []
      let planItems = this.plan.items

      if (!planItems || !this.songs) return

      for (let key in planItems) {
        let action = planItems[key]
        let obj = {
          seqNo: parseInt(action.seq_no),
          key: action.id,
          value: 0,
          warning: false
        }
        if (action.song_id) {
          obj.type = 'song'
          obj.value = action.song_id
          obj.color = this.activityColours.song
          obj.icon = 'record_voice_over'
          obj.title = this.songs[action.song_id] ? this.songs[action.song_id].title : action.song_id
          obj.book_ref = this.songs[action.song_id] ? this.songs[action.song_id].book_ref : action.song_id
        } else if (action.comment && this.isScriptureRef(action.comment)) {
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
      this.plan.actionList = actionList.sort((elemA, elemB) => elemA.seqNo - elemB.seqNo)
    },
    isScriptureRef(text) {
      let found = false
      this.bibleBooksList.forEach(elem => {
        if (text.indexOf(elem) >= 0) found = true
      })
      return found
    }
  },

  created () {
    // make sure we load this at least once
    if (this.bibleBooks === '') {
      this.$store.dispatch('loadBiblebooks')
    }
  }
}
