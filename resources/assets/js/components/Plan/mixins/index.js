/**
 * Mixin for Plan pages
 * 
 * provides all relevant entities for a plan
 */
export default {

  computed: {
    types () {
      return this.$store.getters.types
    },
    typesArray() {
      let types = []
      if (this.types === 'loading') return types
      for (const key in this.types) {
        if (this.types.hasOwnProperty(key)) {
          const element = this.types[key];
          types.push(element)
        }
      }
      return types
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
    },
    activityColours () {
      return this.$store.state.plan.activityColours
    }

  },

  methods: {
    userOwnsPlan (plan) {
      if (!(plan instanceof Object)) return false

      // an admin is always owner
      if (this.$store.getters.userIsAdmin) return true

      // get plan from store and investigate the roles
      let user = this.$store.getters.user
      let check = false
      check = plan.teams.find((rl) => rl.user_id === user.id)
      return check ? true : false
    }
  },

  created () {
    // make sure we load this at least once
    if (this.bibleBooks === '') {
      this.$store.dispatch('loadBiblebooks')
    }
  }
}
