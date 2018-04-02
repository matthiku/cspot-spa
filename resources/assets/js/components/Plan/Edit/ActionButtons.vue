<template>
  <span>

    <!-- action buttons -->
    <v-slide-y-transition>
      <v-card-actions v-if="userOwnsThisPlan" v-show="!editGenericItem">

        <span class="button-group pa-1">
          <span class="title">Add:</span>
          <v-tooltip bottom lazy>
            <v-btn slot="activator" :color="activityColours.song" small class="white--text" @click="addSong">
              <v-icon>{{ activityIcons.song }}</v-icon>
              &nbsp;Song</v-btn>
            <span>Navigates to the song list.<br>There, select a song to be added to this plan.</span>
          </v-tooltip>

          <v-tooltip bottom lazy>
            <v-btn slot="activator" :color="activityColours.read" small class="white--text" @click="addScriptureRefDlg">
              <v-icon>{{ activityIcons.read }}</v-icon>
              &nbsp; Scripture</v-btn>
            <span>Open dialog to add a Scripture Reference to this plan.</span>
          </v-tooltip>

          <v-tooltip bottom lazy>
            <v-btn slot="activator" :color="activityColours.text" small class="white--text" @click="editGenericItem=true">
              <v-icon>{{ activityIcons.text }}</v-icon>
              &nbsp; Gen. Item</v-btn>
            <span>Open dialog to add a generic Text Item to this plan.</span>
          </v-tooltip>
        </span>

        <v-spacer></v-spacer>
        <v-btn small color="purple">
          big Plan</v-btn>

        <v-spacer></v-spacer>
        <v-btn icon @click.native="show = !show">
          <v-icon>{{ show ? 'keyboard_arrow_up' : 'help_outline' }}</v-icon>
        </v-btn>

      </v-card-actions>
    </v-slide-y-transition>

    <!-- show helper text -->
    <v-slide-y-transition>
      <v-card-text v-show="show">
        Activity items will be added into the plan at the location indicated by the thick, maroon-coloured line.
        Initially, this is at the end of the list of items but you can move the "insert indicator" line by 
        clicking on the hamburger menu icon at the right end of each item and selecting the appropriate menu item.
      </v-card-text>
    </v-slide-y-transition>

    <!-- add generic item (text) -->
    <v-slide-y-transition>
      <div v-show="editGenericItem">
        <v-card-text class="pb-0 mb-0">
          <v-text-field
              @keyup.enter="addGenItem"
              label="Item text"
              v-model="genItemText"
              class="mb-0 pb-0"
              hint="enter text and click submit or hit Enter"
              autofocus
              clearable
            ></v-text-field>
        </v-card-text>
        <v-card-actions class="mt-0 pt-0">
          <v-spacer></v-spacer>
          <v-btn color="secondary" flat @click.stop="editGenericItem=false">Close</v-btn>
          <v-btn color="primary" flat @click.stop="addGenItem" :disabled="isEmpty(genItemText)">Submit</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </div>
    </v-slide-y-transition>

    <!-- provide dialog to add a scripture reference activity -->
    <app-edit-plan-add-scripture-dialog></app-edit-plan-add-scripture-dialog>

  </span>  
</template>


<style>
  .button-group {
    border: 1px solid gray;
    border-radius: 5px;
    background-color: rgb(228, 229, 230);
    box-shadow: 1px 2px 3px gray;
  }
</style>


<script>
import genericMixins from '../../../mixins'
import planMixins from '../mixins'

export default {
  mixins: [genericMixins, planMixins],

  props: ['userOwnsThisPlan', 'insertBefore'],

  data () {
    return {
      show: false,
      editGenericItem: false,
      genItemText: ''
    }
  },

  methods: {
    addGenItem () {
      if (!this.genItemText) return
      this.editGenericItem = false
      this.$store.dispatch('addActionItemToPlan', {
        value: this.genItemText,
        planId: this.plan.id,
        type: 'text',
        seqNo: this.insertBefore
      })
      this.genItemText = ''
    },

    addScriptureRefDlg () {
      this.$store.dispatch('setDialog', {field: 'scriptureDlg'})
      if (this.dialog) {
        this.$store.dispatch('showDialog')
        this.$store.dispatch('hideDialog')
      }
      this.$store.dispatch('showDialog')
    },

    isEmpty (what) {
      if (what !== undefined && what !== '' & what !== null) return false
      return true
    },

    addSong () {
      this.$store.dispatch('setDialog', {
        selectedPlan: this.plan.id,
        seqNo: this.insertBefore
      })
      this.$router.push({name: 'addsongtoplan'})
    }
  }
}
</script>
