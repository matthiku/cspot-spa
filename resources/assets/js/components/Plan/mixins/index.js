/**
 * Mixin for Plan pages
 *
 * provides all relevant entities for a plan
 */
export default {
  computed: {
    types() {
      return this.$store.getters.types
    },
    typesArray() {
      let types = []
      if (this.types === 'loading') return types
      for (const key in this.types) {
        if (this.types.hasOwnProperty(key)) {
          const element = this.types[key]
          types.push(element)
        }
      }
      return types
    },
    songs() {
      return this.$store.getters.songs
    },
    songParts() {
      return this.$store.getters.songParts
    },
    plans() {
      return this.$store.getters.plans
    },
    plan() {
      return this.$store.state.plan.plan
    },
    bibleBooks() {
      return this.$store.state.plan.bibleBooks
    },
    apiBibleBooks() {
      return this.$store.state.plan.apiBibleBooks
    },
    apiBibleChapters() {
      return this.$store.state.plan.apiBibleChapters
    },
    apiBibleVerses() {
      return this.$store.state.plan.apiBibleVerses
    },
    bibleBooksList() {
      return this.$store.getters.bibleBooksList
    },
    scriptureRefs() {
      return this.$store.state.plan.scriptureRefs
    },
    activityColours() {
      return this.$store.state.plan.activityColours
    }
  },

  methods: {
    userOwnsPlan(plan, user_id) {
      if (!(plan instanceof Object) || !plan.teams) return false

      // check against the current user or against a specific user?
      if (!user_id) {        
        if (this.$store.getters.userIsAdmin) return true // admin is always owner
        user_id = this.$store.getters.user.id
      }
      // get plan from store and investigate the roles
      let check = false
      check = plan.teams.find(rl => rl.user_id === user_id)
      return check ? true : false
    }
  },

  created() {
    // make sure we load this at least once
    if (this.bibleBooks === '') {
      this.$store.dispatch('loadBiblebooks')
    }
  }
}
