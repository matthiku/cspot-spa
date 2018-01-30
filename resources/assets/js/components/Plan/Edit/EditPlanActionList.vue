<template>
  <v-card>

    <!-- show plan activity items -->
    <v-card-text class="grey lighten-3 pb-1">
      <v-list two-line dense>

        <!-- loop through all plan action items -->
        <template v-for="(item, index) in actionList">

          <v-list-tile
              :id="'activity-item-' + index"
              :draggable="userOwnsThisPlan" 
              :key="index"
              @dragstart="drag"
              @drop="drop"
              @dragenter="dragenter"
              @dragleave="dragleave"
              @dragover="dragover"
              @dragend="dragend"
              avatar>

            <v-list-tile-action title="drag items to re-arrange sequence"
                :id="'drop-item-' + index"
                v-if="userOwnsThisPlan"
                class="cursor-n-resize"
              ><v-icon>swap_vert</v-icon>
            </v-list-tile-action>

            <v-list-tile-avatar :title="item.type">
              <v-icon :class="item.color" class="white--text">{{ item.icon }}</v-icon>
            </v-list-tile-avatar>

            <!-- show actual item detail -->
            <v-list-tile-content v-if="!item.warning" class="show-on-hover">
              <v-list-tile-title>
                ({{ item.seqNo }})
                <strong  :id="item.key"
                    :contenteditable="userOwnsThisPlan && item.type === 'text'"
                    @keydown.enter.stop="updateActivityText"
                    class="white-space-normal py-1 pr-1"
                  >
                  {{ item.title }}
                </strong>
                <span
                    v-if="userOwnsThisPlan && item.type === 'text'"
                    class="on-hover-only"
                    title="click text to edit"
                  ><v-icon>edit</v-icon></span> 
              </v-list-tile-title>
              <v-list-tile-sub-title>{{ item.book_ref }}</v-list-tile-sub-title>
            </v-list-tile-content>


            <!-- view when deleting an item -->
            <v-list-tile-content v-if="item.warning" >
              <v-list-tile-sub-title class="red--text mt-0 pt-0">Removing {{ item.book_ref }} ({{ item.title }})?
                <v-btn flat small @click="removeAction(item)" color="red">Yes<v-icon>info</v-icon></v-btn>
                <v-btn flat small @click="item.warning = false">Cancel<v-icon>highlight_off</v-icon></v-btn>
              </v-list-tile-sub-title>
            </v-list-tile-content>


            <!-- action buttons -->
            <v-list-tile-action 
                v-if="!item.warning && item.type === 'song' && songs[item.value] &&  songs[item.value].youtube_id">               
                <!-- modal to show youtube videos -->
                <app-show-youtube-modal :youtube-id="songs[item.value].youtube_id"></app-show-youtube-modal>
            </v-list-tile-action>

            <v-list-tile-action v-if="!item.warning">
              <v-tooltip bottom>
                <v-btn icon ripple slot="activator"
                    ><v-icon>airplay</v-icon>
                </v-btn>
                <span>start presentation here (once implemented)</span>
              </v-tooltip>
            </v-list-tile-action>

            <v-list-tile-action v-if="!item.warning && userOwnsThisPlan">
              <v-tooltip bottom>
                <v-btn icon ripple  slot="activator"
                    @click="item.warning = true"
                  ><v-icon color="red lighten-1">delete</v-icon>
                </v-btn>
                <span>remove this item</span>
              </v-tooltip>
            </v-list-tile-action>

            <v-list-tile-action v-if="!item.warning">
              <!-- sample menu option -->
              <v-menu offset-x open-on-hover full-width>
                <v-btn icon ripple slot="activator">
                  <v-icon>menu</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile v-for="mItem in menuItems" :key="mItem.title" @click="mSelect(mItem, item)">
                    <v-list-tile-title>{{ mItem.title }}</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
            </v-list-tile-action>

          </v-list-tile>

          <v-divider v-if="index + 1 < actionList.length" :key="item.key"></v-divider>
        </template>

        <p class="text-xs-center ma-0">
          <span v-if="!actionList.length">(no items added yet)</span>
        </p>
      </v-list>
    </v-card-text>

    <!-- provide dialog to add a scripture reference activity -->
    <app-edit-plan-action-scripture-dialog></app-edit-plan-action-scripture-dialog>

    <!-- action buttons -->
    <v-slide-y-transition>
      <v-card-actions v-if="userOwnsThisPlan" v-show="!editGenericItem">

        <v-btn :color="activityColours.song" small class="white--text" @click="addSong">
          <v-icon>record_voice_over</v-icon>
          &nbsp;Add Song</v-btn>

        <v-btn :color="activityColours.read" small class="white--text" @click="addScriptureRefDlg">
          <v-icon>local_library</v-icon>
          &nbsp; Add Scripture</v-btn>

        <v-btn :color="activityColours.text" small class="white--text" @click="editGenericItem=true">
          <v-icon>label</v-icon>
          &nbsp; Add Gen. Item</v-btn>

        <v-spacer></v-spacer>
        <v-btn small color="purple" @click="$store.commit('setLoading', true)">
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
        I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.
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

  </v-card>

</template>

<style>
  .white-space-normal {
    white-space: normal;
  }
  .drop-insert-indicator {
    background-color:aqua;
    height: 0.5em;
    line-height: 0.7;
  }
</style>


<script>
  import genericMixins from '../../../mixins'
  import planMixins from '../mixins'

  export default {
    mixins: [genericMixins, planMixins],

    props: ['planId', 'userOwnsThisPlan'],

    computed: {
      plans () {
        return this.$store.getters.plans
      },
      activitiesCount () {
        if (!this.plan || !this.plan.actionList) return 0
        return this.plan.actionList.length
      }
    },

    data () {
      return {
        plan: {},
        show: false,
        editGenericItem: false,
        genItemText: '',
        showMenu: false,
        actionList: [],
        targetId: null,
        menuItems: [
          { title: 'Edit this item' },
          { title: 'Add item above' },
          { title: 'Add item below' },
          { title: 'Delete this item' }
        ]
      }
    },

    methods: {
      // user selected an action on a listed plan activity (in the hamburger menu)
      mSelect (action, activity) {
        console.log(action.title, activity.title)
      },

      updateActivityText (event) {
        event.preventDefault()
        if (!this.userOwnsThisPlan) return
        let key = event.target.id
        if (!key) return
        // update the text on the backend DB
        this.$store.dispatch('updateActionItem', {
          planId: this.plan.id,
          key,
          field: 'value',
          newValue: event.target.outerText
        }).then(() => {
          // stop the content editing
          event.srcElement.contentEditable = false
          event.srcElement.contentEditable = true
        })
      },

      // the user dropped the element on a Plan Activity - now handle the move
      drop (event) {
        event.target.style.opacity = '1'
        event.preventDefault()
        // get the seqNo of the Activity that was dragged
        let start = this.findIdNum(event.dataTransfer.getData('text'))
        // get the seqNo of the target Activity
        let end = this.findIdNum(this.targetId)
        // if all went well we should have 2 different sequence numbers
        if (!isNaN(start) && !isNaN(end) && start !== end) {
          // change the seqNo of the dragged Activity so that it comes AFTER the target Activity
          this.changeSeqNo(end, 1 * parseFloat(end) + 0.5)
          this.changeSeqNo(start, parseFloat(end))
          this.correctAllSeqNos()
        }
      },
      // modify the target id (seqNo) when the dragging goes over an Plan Activity
      dragover (event) {
        event.preventDefault()
      },
      dragenter (event) {
        let targetLi = this.getParent(event, '.list__tile')
        if (!targetLi) return
        if (this.targetId === targetLi.id) return
        this.targetId = targetLi.id

        this.destroyOldInsertIndicator()
        let kid = document.createElement('li')
        kid.classList.add('drop-insert-indicator')
        let parent = targetLi.parentElement.parentElement
        parent.insertBefore(kid, targetLi.parentElement)
      },
      destroyOldInsertIndicator () {
        let elms = document.getElementsByClassName('drop-insert-indicator')
        if (!elms.length) return
        elms[0].remove()
      },
      dragleave (event) {
        let targetLi = this.getParent(event, '.list__tile')
        if (!targetLi) return
        if (targetLi.id === this.targetId) return
        targetLi.classList.remove('dragged-over')
      },
      dragend (event) {
        event.target.style.opacity = '1'
        this.destroyOldInsertIndicator()
      },
      // user begins the dragging - remember the corresponding seqNo of the Activity from where he started
      drag (event) {
        event.target.style.opacity = '0.3'
        event.dataTransfer.setData('text', event.target.id)
      },
      removeClass (className) {
        let elems = document.getElementsByClassName(className)
        if (elems && elems.length) {
          Array.prototype.forEach.call(elems, (el) => {
            el.classList.remove(className)
          })
        }
      },
      // each event contains a path-an array of parent elements. Returns the one identified by 'selector'
      getParent (event, selector) {
        if (!event.path || !event.path.length || !selector) return
        let found = event.path.find((elem) => {
          if (elem.localName === 'body' || elem.name === '') return false
          // is 'selector' the name of the html element?
          if (elem.localName === selector) return true
          // is 'selector' one of the classes?
          if (elem.classList && elem.classList.contains(selector.substr(1))) return true
        })
        // console.log('FOUND', found.id)
        return found
      },
      // the target html element contains an ID in the format xxx-xxx-id
      findIdNum (id) {
        if (!id) return false
        let parts = id.split('-')
        if (!parts.length === 3) return false
        return parseInt(parts[2])
      },
      // find the Activity where seqNo is <from> and change it to <to>
      changeSeqNo (from, to) {
        this.actionList.forEach((elem) => {
          if (parseInt(elem.seqNo) === parseInt(from)) {
            elem.seqNo = to
          }
        })
      },
      correctAllSeqNos () {
        // first, sort the array again with the new, intermediate seqNos
        this.sortActionList()
        // now change the seqNo into integers again
        this.$store.commit('setLoading', true)
        let idx = 0
        this.actionList.forEach((elem) => {
          // correct the seqNo
          elem.seqNo = idx++
          // report the change back to the backend DB
          let obj = {
            planId: this.plan.id,
            key: elem.key,
            field: 'seqNo',
            newValue: elem.seqNo
          }
          this.$store.dispatch('updateActionItem', obj)
            .then(() => {
              // after the last action, make sure we update the local data
              if (idx >= this.actionList.length) {
                this.$store.commit('setMessage', 'Plan Activities sequence updated.')
                // this.$store.dispatch('refreshPlans').then()
              }
            })
        })
      },

      isEmpty (what) {
        if (what !== undefined && what !== '' & what !== null) return false
        return true
      },
      addGenItem () {
        if (!this.genItemText) return
        this.editGenericItem = false
        this.$store.dispatch('addActionItemToPlan', {
          value: this.genItemText,
          planId: this.plan.id,
          type: 'text',
          seqNo: this.activitiesCount
        })
        this.genItemText = ''
      },
      addSong () {
        this.$store.dispatch('setDialog', {
          selectedPlan: this.plan.id,
          seqNo: this.activitiesCount
        })
        this.$router.push({name: 'addsongtoplan'})
      },
      addScriptureRefItem () {
        this.$store.dispatch('addActionItemToPlan', {
          planId: this.plan.id,
          type: 'read',
          value: this.dialog.value,
          seqNo: this.activitiesCount
        })
      },
      addScriptureRefDlg () {
        this.$store.dispatch('setDialog', {field: 'scriptureDlg'})
        if (this.dialog) {
          this.$store.dispatch('showDialog')
          this.$store.dispatch('hideDialog')
        }
        this.$store.dispatch('showDialog')
      },
      removeAction (item) {
        this.$store.dispatch('removeActionFromPlan', {
          planId: this.plan.id,
          actionId: item.key
        })
      },

      openYoutubeModal (id) {
        this.$store.commit('setDialog', {
          type: 'youtube-modal',
          value: id
        })
        this.$store.commit('showDialog')
      },

      // populate the local plan by finding it with the given plan ID
      getPlan () {
        return this.plans.find(plan => {
          return plan.id === this.planId
        })
      },
      // create a copy of the list of actions for this plan - this enables better handling in this view
      createPlanActionsList () {
        if (!this.plans) return
        this.plan = this.getPlan()
        if (!this.plan.id) return
        this.actionList = []
        let planItems = this.plan.actions
        if (!planItems || !this.songs) return

        for (let key in planItems) {
          let action = planItems[key]
          let obj = {
            type: action.type,
            value: action.value ? action.value : 0,
            key,
            seqNo: action.seqNo,
            warning: false
          }
          if (action.type === 'song' && this.songs[action.value]) {
            obj.color = this.activityColours.song
            obj.icon = 'record_voice_over'
            obj.title = this.songs[action.value].title
            obj.book_ref = this.songs[action.value].book_ref
          }
          if (action.type === 'text') {
            obj.color = 'lime darken-2'
            obj.icon = 'label'
            obj.title = action.value
          }
          if (action.type === 'read') {
            obj.color = 'cyan lighten-3'
            obj.icon = 'local_library'
            obj.title = action.value
          }
          this.actionList.push(obj)
        }
        this.sortActionList()
      },
      sortActionList () {
        this.plan.actionList = this.actionList.sort((elemA, elemB) => elemA.seqNo > elemB.seqNo)
      }
    },

    created () {
      this.createPlanActionsList()
      this.$store.dispatch('hideDialog')
    },
    watch: {
      dialog (val) {
        if (val.field === 'scriptureRef' && val.value) {
          this.addScriptureRefItem()
        }
      },
      planId () {
        this.createPlanActionsList()
      },
      plan () {
        this.createPlanActionsList()
      },
      plans () {
        this.createPlanActionsList()
      },
      users () {
        this.createPlanActionsList()
      }
    }
  }
</script>
