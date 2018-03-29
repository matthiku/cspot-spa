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
    songPartsArray() {
      return this.$store.getters.songPartsArray
    },
    plans() {
      return this.$store.getters.plans
    },
    plan() {
      return this.$store.state.plan.plan
    },
    actionList() {
      return this.plan.actionList || []
    },
    presentation() {
      return this.$store.getters.presentation
    },
    bibleBooks() {
      return this.$store.state.plan.bibleBooks
    },
    bibleChapters() {
      return this.$store.state.plan.bibleChapters
    },
    bibleVerses() {
      return this.$store.state.plan.bibleVerses
    },
    scriptureRefs() {
      return this.$store.state.plan.scriptureRefs
    },
    activityColours() {
      return this.$store.state.plan.activity.colours
    },
    activityIcons() {
      return this.$store.state.plan.activity.icons
    },
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
      check = plan.teams.find((rl) => rl.user_id === user_id)
      return check ? true : false
    },

    getLyricsFromOnsong(onsong) {
      // extract the lyrics from lines of onsong code
      // input: "Amazing [D]Grace, how [G]sweet the [D]sound"
      // output: "Amazing Grace, how sweet the sound"
      onsong = onsong.replace(/\[[a-z|0-9|/|#]+\]/gi, '')
      // replace excessive spaces
      onsong = onsong.replace(/ +/g, ' ')
      // 1. remove lines with musical instructions, e,g, "(no music)"
      onsong = onsong.replace(/^\(.+\)$\n/gim, '')
      return onsong
    },

    lineIsRegionTwo(line) {
      // search for "REGION 2" in the text line (with or without the space character)
      var patt = /^\[region\s*2\]/i
      if (patt.test(line)) {
        return true
      }
      return false
    },

    isLyricsHeader(line) {
      var patt = /\[region\s*2\]/i
      if (patt.test(line)) return false
      var patt = /^\[/
      if (patt.test(line)) return true
      return false
    },

    /**
     * @description: Create single slides from a block of text (multiple lines)
     *               with emptly lines as separators     *
     * @argument block (string) with possibly mulitple lines of text,
     *                          possibly containing one or more empty lines     *
     * @returns: (array) slides, each containing an array of text lines
     */
    splitByEmptyLine(block) {
      let output = []
      let slide = []
      let lines = block.split('\n')
      let isRegion2 = false
      lines.forEach((line) => {
        if (line.trim() !== '' && !this.isLyricsHeader(line)) {
          // ignore a leading dot (line is to be ignored in Chords view only)
          if (line.indexOf('.') === 0) line = line.substr(1)
          // check for Region 2 lines
          if (!isRegion2) {
            if (this.lineIsRegionTwo(line)) {
              isRegion2 = true
              line = '<hr>'
            }
          } else {
            line = '[Region 2]' + line
          }
          slide.push(line.trim())
        } else if (slide.length) {
          output.push(slide)
          slide = []
          isRegion2 = false
        } else {
          slide = []
          isRegion2 = false
        }
      })
      if (slide.length) output.push(slide)
      return output
    },
  },

  created() {
    // make sure we load this at least once
    if (
      !Object.keys(this.songParts).length ||
      !(this.songPartsArray instanceof Array) ||
      this.songPartsArray === 'loading'
    ) {
      setTimeout(() => {
        if (
          !Object.keys(this.songParts).length ||
          !(this.songPartsArray instanceof Array) ||
          this.songPartsArray === 'loading'
        ) {
          console.log('reloading songParts!', Object.keys(this.songParts))
          this.$store.dispatch('loadSongParts')
        }
      }, 5000)
    }
  },
}
