<template>
  <span>

    <v-chip outline
        v-if="songsCount"
        :color="activityColours.song"
        class="plan-actions-title ma-0"
      ><v-tooltip bottom lazy>
        <span slot="activator">
          <v-icon :color="activityColours.song">{{ activityIcons.song }}</v-icon>
          {{ songsCount }}
          song{{ songsCount > 1 ? 's' : ''}}
        </span>
        <span>number of songs</span>
      </v-tooltip>
    </v-chip>

    <v-chip outline
        v-if="othersCounts"
        :color="activityColours.text"
        class="plan-actions-title ma-0"
      ><v-tooltip bottom lazy>
        <span slot="activator">      
          <v-icon :color="activityColours.text">{{ activityIcons.text }}</v-icon>
          {{ othersCounts }} gen.item{{ othersCounts > 1 ? 's' : ''}}
        </span>
        <span>generic items</span>
      </v-tooltip>
    </v-chip>

    <v-chip
        v-if="scripturesCount"
        outline
        :color="activityColours.read"
        class="plan-actions-title ma-0"
      ><v-tooltip bottom lazy>
        <span slot="activator">
          <v-icon :color="activityColours.read">{{ activityIcons.read }}</v-icon>
          {{ scripturesCount }} reading{{ scripturesCount > 1 ? 's' : ''}}
        </span>
        <span>number of scripture readings</span>
      </v-tooltip>
    </v-chip>

    <small v-if="songsCount + scripturesCount + othersCounts === 0">(empty)</small>

  </span>
</template>


<script>
export default {

  computed: {
    plan() {
      return this.$store.state.plan.plan
    },
    songsCount () {
      return this.getCounter(this.plan.actionList, 'song')
    },
    scripturesCount () {
      return this.getCounter(this.plan.actionList, 'read')
    },
    activityIcons() {
      return this.$store.state.plan.activity.icons
    },
    activityColours() {
      return this.$store.state.plan.activity.colours
    },
    othersCounts () {
      return this.getCounter(this.plan.actionList, 'text')
    }
  },

  methods: {
    getCounter (actions, type) {
      if (!this.plan) return 0
      if (!actions) return 0

      let counter = 0
      for (let index = 0; index < actions.length; index++) {
        const item = actions[index]
        if (item.type === type) counter++
      }
      return counter
    }
  }
}
</script>
