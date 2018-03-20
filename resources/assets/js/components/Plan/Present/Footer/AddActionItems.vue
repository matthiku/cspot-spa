<template>
  <div class="text-xs-center">
    <v-menu
        bottom
        v-model="menu"
        nudge-left="200"
        nudge-top="50"
        :close-on-content-click="false"
      >
      <v-btn icon dark slot="activator">
        <v-icon :color="firstVisibleItem ? '' : 'red'">playlist_add</v-icon>
      </v-btn>

      <app-edit-plan-action-scripture-dialog
          ref="addScrDlg"
        ></app-edit-plan-action-scripture-dialog>

      <select-song-dialog ref="addSongDlg"
        ></select-song-dialog>

      <v-card dark>

        <v-card-actions>
          <v-btn @click="addScripture"><v-icon>{{ activityIcons.read }}</v-icon>&nbsp;Scripture</v-btn>
          <v-btn @click="addSong"><v-icon>{{ activityIcons.song }}</v-icon>&nbsp;Song</v-btn>
        </v-card-actions>

      </v-card>
    </v-menu>
  </div>
</template>

<script>
import selectSongDialog from './SelectSongDialog'

export default {
  components: { selectSongDialog },

  props: ['firstVisibleItem'],

  data () {
    return {
      menu: false
    }
  },

  computed: {
    activityIcons() {
      return this.$store.state.plan.activity.icons
    }
  },

  methods: {
    addScripture () {
      this.menu = false
      // show dialog to select scripture
      this.$store.commit('setDialog', {field: 'scriptureDlg', dark: true})
      this.$store.commit('showDialog')
      // move the dialogbox to the bottom of the screen
      let dlg = this.$refs.addScrDlg
      if (dlg) {
        dlg = dlg.$children[0].$children[0].$el
        dlg.style.position = 'absolute'
        dlg.style.top = window.innerHeight - dlg.offsetHeight
        dlg.style.maxWidth = '700px'
      }
    },

    addSong () {
      this.menu = false
      // show dialog to select a song
      this.$store.commit('setDialog', {field: 'selectSongDlg', dark: true})
      this.$store.commit('showDialog')
      // move the dialogbox to the bottom of the screen
      let dlg = this.$refs.addSongDlg
      if (dlg) {
        dlg = dlg.$children[0].$children[0].$el
        dlg.style.position = 'absolute'
        dlg.style.top = window.innerHeight - dlg.offsetHeight
        dlg.style.minWidth = '600px'
      }
    }    
  }
}
</script>