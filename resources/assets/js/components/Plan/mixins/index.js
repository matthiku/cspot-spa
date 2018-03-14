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
    presentation() {
      return this.$store.state.plan.presentation
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
    },

    getLyricsFromOnsong(onsong) {
      // extrace the lyrics from lines of onsong code
      // input: "Amazing [D]Grace, how [G]sweet the [D]sound"
      // output: "Amazing Grace, how sweet the sound"
      onsong = onsong.replace(/\[[a-z|0-9|/|#]+\]/gi, '')
      // replace excessive spaces
      onsong = onsong.replace(/ +/g, ' ')
      // 1. remove lines with musical instructions, e,g, "(no music)"
      onsong = onsong.replace(/^\(.+\)$\n/gim, '')
      return onsong
    }
  },

  created() {
    // make sure we load this at least once
    if (
      !Object.keys(this.songParts).length ||
      this.$store.state.song.songPartsArray === 'loading'
    ) {
      console.log('reloading songParts!')
      this.$store.dispatch('loadSongParts')
    }
  }
}
