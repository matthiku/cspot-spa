<template>
  <v-card>

    <span v-if="overallOnly !== undefined">
      <transition name="fade">
        <v-toolbar v-if="showHealthGraph"
            flat class="transparent" height="150">
          <v-list>
            <v-list-tile-content class="ml-4">

              <div class="health-status">
                Data {{ overAllHealth === 100 ? 'ready!' : 'loading:' }}
                <v-progress-circular
                    :size="90"
                    :width="15"
                    :rotate="360"
                    :value="overAllHealth"
                    :color="overAllHealthColour"
                  >{{ overAllHealth }}%
                </v-progress-circular>
              </div>

            </v-list-tile-content>
          </v-list>
        </v-toolbar>
      </transition>
    </span>

    <span v-else>

      <v-list two-line subheader>

        <v-subheader>Base Entities</v-subheader>

        <v-list-tile :color="eventsCount ? 'green' : 'red'">
          <v-list-tile-content>
            <v-list-tile-title>Events List</v-list-tile-title>
            <v-list-tile-sub-title>
              Number of (loaded) events: <span class="subheading">{{ eventsCount }}</span>
              <span :title="plansUpdatedAt">- Last updated: {{ plansUpdatedAt | dateDiff }}</span>
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile :color="songsCount ? 'green' : 'red'">
          <v-list-tile-content>
            <v-list-tile-title>Songs</v-list-tile-title>
            <v-list-tile-sub-title>
              Number of songs: <span class="subheading">{{ songsCount }}</span>
              <span :title="songsUpdatedAt">- Last updated: {{ songsUpdatedAt | dateDiff }}</span>
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile :color="usersCount ? 'green' : 'red'">
          <v-list-tile-content>
            <v-list-tile-title>Users</v-list-tile-title>
            <v-list-tile-sub-title>
              Number of users: <span class="subheading">{{ usersCount }}</span>
              <span :title="usersUpdatedAt">- Last updated: {{ usersUpdatedAt | dateDiff }}</span>
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-divider></v-divider>

      <v-list two-line subheader>

        <v-subheader>Helper Entities</v-subheader>

        <v-list-tile avatar>
          <v-list-tile-action>
            <v-icon :color="rolesOK ? 'green' : 'red'">{{ rolesOK ? 'check_box' : 'check_box_outline_blank'}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Roles</v-list-tile-title>
            <v-list-tile-sub-title>User roles object by ID</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile avatar>
          <v-list-tile-action>
            <v-icon :color="rolesByNameOK ? 'green' : 'red'">{{ rolesByNameOK ? 'check_box' : 'check_box_outline_blank'}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Roles By Name</v-list-tile-title>
            <v-list-tile-sub-title>User roles object by role name</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile avatar>
          <v-list-tile-action>
            <v-icon :color="typesOK ? 'green' : 'red'">{{ typesOK ? 'check_box' : 'check_box_outline_blank'}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Types</v-list-tile-title>
            <v-list-tile-sub-title>Event types as object</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile avatar>
          <v-list-tile-action>
            <v-icon :color="typesArrayOK ? 'green' : 'red'">{{ typesArrayOK ? 'check_box' : 'check_box_outline_blank'}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Types as Array</v-list-tile-title>
            <v-list-tile-sub-title>Event types as array</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile avatar>
          <v-list-tile-action>
            <v-icon :color="songPartsOK ? 'green' : 'red'">{{ songPartsOK ? 'check_box' : 'check_box_outline_blank'}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Song Parts</v-list-tile-title>
            <v-list-tile-sub-title>Song parts names table</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile avatar>
          <v-list-tile-action>
            <v-icon :color="songPartsArrayOK ? 'green' : 'red'">{{ songPartsArrayOK ? 'check_box' : 'check_box_outline_blank'}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Song Parts Array</v-list-tile-title>
            <v-list-tile-sub-title>Song parts as array</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile avatar>
          <v-list-tile-action>
            <v-icon :color="bibleBooksOK ? 'green' : 'red'">{{ bibleBooksOK ? 'check_box' : 'check_box_outline_blank'}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Bible Books</v-list-tile-title>
            <v-list-tile-sub-title>Bible book names table contains {{ bibleBooks ? bibleBooks.length : 0 }} entries</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile avatar>
          <v-list-tile-action>
            <v-icon :color="bibleChaptersOK ? 'green' : 'red'">{{ bibleChaptersOK ? 'check_box' : 'check_box_outline_blank'}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Bible Chapters</v-list-tile-title>
            <v-list-tile-sub-title>Table with number of chapters for each book</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile avatar>
          <v-list-tile-action>
            <v-icon :color="bibleVersesOK ? 'green' : 'red'">{{ bibleVersesOK ? 'check_box' : 'check_box_outline_blank'}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Bible Verses</v-list-tile-title>
            <v-list-tile-sub-title>Table with number of verses per chapter per book</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

      </v-list>

    </span>
    
  </v-card>
</template>

<style lang="stylus" scoped>
  .health-status
    text-align: center
  .progress-circular 
    vertical-align: top
</style>


<script>
import genericMixins from '../../mixins/'
import planMixins from '../Plan/mixins'

export default {

  mixins: [genericMixins, planMixins],

  props: ['overallOnly'],

  data () {
    return {
      showHealthGraph: true
    }
  },

  computed: {
    eventsCount () { return (this.plans instanceof Array) && this.plans && this.plans.length },
    songsCount () { return (this.songs instanceof Object) && Object.keys(this.songs).length },
    usersCount () { return (this.users instanceof Object) && Object.keys(this.users).length },
    rolesOK () { return this.roles instanceof Object },
    rolesByNameOK () { return this.rolesByName instanceof Object },
    typesOK () { return this.types instanceof Object },
    typesArrayOK () { return this.typesArray.length && this.typesArray instanceof Array },
    songPartsOK () { return this.songParts instanceof Object },
    songPartsArrayOK () { return (this.songPartsArray instanceof Array) && this.songPartsArray.length },
    bibleBooksOK () { return this.bibleBooks instanceof Object },
    bibleChaptersOK () { return this.bibleChapters instanceof Object },
    bibleVersesOK () { return this.bibleVerses instanceof Object },

    overAllHealth () {
      let health = 0
      if (this.eventsCount) health += 1
      if (this.songsCount) health += 1
      if (this.usersCount) health += 1
      if (this.rolesOK) health += 1
      if (this.rolesByNameOK) health += 1
      if (this.typesOK) health += 1
      if (this.typesArrayOK) health += 1
      if (this.songPartsOK) health += 1
      if (this.songPartsArrayOK) health += 1
      if (this.bibleBooksOK) health += 1
      if (this.bibleChaptersOK) health += 1
      if (this.bibleVersesOK) health += 1

      return parseInt(health * 100 / 12)
    },

    overAllHealthColour () {
      return this.overAllHealth < 75 ? 'red' : this.overAllHealth === 100 ? 'green' : 'amber'
    },
    plansUpdatedAt () {
      return this.$store.getters.plansUpdatedAt
    },
    songsUpdatedAt () {
      return this.$store.getters.songsUpdatedAt
    },
    usersUpdatedAt () {
      return this.$store.getters.usersUpdatedAt
    }
  },

  methods: {
    checkHealth () {
      // repeat this check until full health is reached
      if (this.overAllHealth < 100) {
        setTimeout(() => {
          this.checkHealth()
        }, 9000)
      } else {
        // health graph can disappear shortly after app is healthy
        this.showHealthGraph = false
      }
    }
  },

  mounted () {
    this.checkHealth()
  }
}
</script>
