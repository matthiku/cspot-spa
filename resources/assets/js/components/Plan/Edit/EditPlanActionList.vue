<template>
  <v-card>

    <!-- show plan activity items -->
    <v-card-text class="grey lighten-3 pb-1">

      <v-list id="activities-list" two-line dense>

        <!-- loop through all plan action items -->
        <template v-for="(item, index) in plan.actionList">

          <v-list-tile
              :id="'activity-item-' + item.seqNo"
              :draggable="userOwnsThisPlan" 
              :key="index"
              @dragstart="drag"
              @drop="drop"
              @dragenter="dragenter"
              @dragleave="dragleave"
              @dragover="dragover"
              @dragend="dragend"
              avatar
            >
            <v-list-tile-action title="drag items to re-arrange sequence"
                :id="'drop-item-' + item.key"
                v-if="userOwnsThisPlan"
                class="min-w-25 cursor-n-resize"
              ><v-icon>swap_vert</v-icon>
            </v-list-tile-action>

            <v-list-tile-avatar :title="item.type==='song' ? item.lyrics : item.type==='read' ? scriptureRefs[item.title] : ''">
              <v-icon :class="[item.color]" class="white--text">{{ item.icon }}</v-icon>
            </v-list-tile-avatar>

            <!-- show actual item detail -->
            <v-list-tile-content v-if="!item.warning" class="show-on-hover">
              <v-list-tile-title>

                <span :id="item.key"
                    :contenteditable="userOwnsThisPlan && item.type === 'text'"
                    @keydown.enter.stop="updateActivityText"
                    :class="{
                        'body-2': item.type!=='text',
                        'indigo--text': item.type==='song',
                        'cyan--text': item.type==='read',
                        'lime--text text--darken-3': item.type==='text'
                      }"
                    class="strong white-space-normal py-1 pr-1"
                  >
                  <!-- ({{ item.seqNo }}) -->
                  <v-tooltip bottom lazy offset-overflow v-if="item.type!=='text'">
                    <span slot="activator">{{ item.title }}</span>
                    <pre v-if="item.type==='song'">{{ item.lyrics }}</pre>
                    <pre v-if="item.type==='read'">{{ getScriptureRefText(item.title) }}</pre>
                  </v-tooltip>
                  <span v-else>{{ item.title }}</span>
                  <span v-if="item.subtitle">({{ item.subtitle }})</span>
                </span>

                <span class="on-hover-only"
                    v-if="userOwnsThisPlan && item.type === 'text'"
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
              <v-tooltip bottom v-if="!item.forLeadersEyesOnly">
                <v-btn icon ripple slot="activator"
                    ><v-icon>airplay</v-icon>
                </v-btn>
                <span>start presentation here (once implemented)</span>
              </v-tooltip>
              <v-tooltip bottom v-else>
                <v-btn icon ripple slot="activator"
                    ><v-icon>remove_red_eye</v-icon></v-btn>
                <span>for leader's eyes only</span>
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

          <v-divider v-if="plan.actionList && index + 1 < plan.actionList.length" :key="item.key"></v-divider>
        </template>

        <v-list-tile v-show="activitiesCount"
            id="insert-indicator"
            title="items will be inserted here"
            class="drop-insert-indicator"></v-list-tile>

      </v-list>

      <p class="text-xs-center ma-0">
        <span v-if="!plan.actionList || !plan.actionList.length">(no activity items)</span>
      </p>

    </v-card-text>

    <!-- action buttons to add activity items to this plan -->
    <app-edit-plan-action-buttons
        :insertBefore="insertBefore"
        :userOwnsThisPlan="userOwnsThisPlan">
    </app-edit-plan-action-buttons>

  </v-card>

</template>


<style>
  .min-w-25 {
    min-width: 25px;
  }
  .white-space-normal {
    white-space: normal;
  }
  .drop-insert-indicator {
    background-color:maroon;
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
      activitiesCount () {
        if (!this.plan || !this.plan.actionList) return 0
        return this.plan.actionList.length
      },
      actionList () {
        return this.plan.actionList || []
      }
    },

    data () {
      return {
        needToMove: false,
        oldActionListCount: 0,
        insertBefore: 0,
        showMenu: false,
        targetId: null,
        menuItems: [
          { id: 'insAbove', title: 'Insert item above' },
          { id: 'insBelow', title: 'Insert item below' },
          { id: 'editFleo', title: 'Swap FLEO flag' },
          { id: 'delete', title: 'Delete this item' }
        ]
      }
    },

    methods: {
      // user selected an action on a listed plan activity (in the hamburger menu)
      mSelect (action, activity) {
        if (action.id === 'insAbove') {
          this.insertBefore = activity.seqNo - 1
          this.moveInsertIndicator()
        }
        if (action.id === 'insBelow') {
          this.insertBefore = activity.seqNo
          this.moveInsertIndicator()
        }
        if (action.id === 'delete') {
          activity.warning = true
        }
        if (action.id === 'editFleo') {
          activity.forLeadersEyesOnly = !activity.forLeadersEyesOnly
          let obj = {
            planId: this.plan.id,
            actionId: activity.key,
            field: 'forLeadersEyesOnly',
            newValue: activity.forLeadersEyesOnly
          }
          this.$store.dispatch('updateActionItem', obj)
        }
      },

      updateActivityText (event) {
        event.preventDefault()
        if (!this.userOwnsThisPlan) return
        let key = event.target.id
        if (!key) return
        // update the text on the backend DB
        this.$store.dispatch('updateActionItem', {
          planId: this.plan.id,
          actionId: key,
          field: 'comment',
          newValue: event.target.outerText
        }).then(() => {
          // stop the content editing
          event.srcElement.contentEditable = false
          event.srcElement.contentEditable = true
        })
      },

      moveInsertIndicator () {
        let position = this.insertBefore

        // get the existing InsertIndicator LI element or create a new one
        let indicLi = document.getElementById('insert-indicator').parentNode

        // get the parent UL element
        let parentUL = indicLi.parentNode

        // temporarily remove the indicator from the DOM
        indicLi.parentNode.removeChild(indicLi)

        // get all LI children in order to find the n-th child (according to the given seqNo)
        let childrenLI = parentUL.getElementsByTagName('li')
        let count = childrenLI.length

        // if the seqNo is higher than the number of LI elements,
        // append the indicator to the end
        if (count < position) {
          parentUL.appendChild(indicLi)
        } else {
          parentUL.insertBefore(indicLi, childrenLI[position])
        }
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
          this.changeSeqNo(start, parseFloat(end) - 0.1)
          this.correctAllSeqNos()
        }
      },
      // modify the target id (seqNo) when the dragging goes over an Plan Activity
      dragover (event) {
        event.preventDefault()
      },
      // set the insert indicator above this element
      dragenter (event) {
        let targetLi = this.getParent(event, '.list__tile')
        if (!targetLi) return
        if (this.targetId === targetLi.id) return
        this.targetId = targetLi.id
        // get the indicator and move it above the current element
        let kid = document.getElementById('insert-indicator').parentNode
        kid.parentNode.removeChild(kid) // temporarily remove it from the (visible) DOM
        let parentUL = targetLi.parentElement.parentElement // find the parent UL element
        parentUL.insertBefore(kid, targetLi.parentElement) // insert the indicator into the new location
      },
      dragleave (event) {
        let targetLi = this.getParent(event, '.list__tile')
        if (!targetLi) return
        if (targetLi.id === this.targetId) return
        targetLi.classList.remove('dragged-over')
      },
      dragend (event) {
        event.target.style.opacity = '1'
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
        this.plan.actionList.forEach((elem) => {
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
        let idx = 1
        this.actionList.forEach((elem) => {
          let oldSeqNo = elem.seqNo
          // correct the seqNo
          elem.seqNo = idx++
          // report the change back to the backend DB
          if (oldSeqNo !== elem.seqNo) {
            // console.log('seqNo has changed', oldSeqNo, elem.seqNo)
            let obj = {
              planId: this.plan.id,
              actionId: elem.key,
              field: 'seq_no',
              newValue: elem.seqNo
            }
            this.$store.dispatch('updateActionItem', obj)
              .then(() => {
                // after the last action, make sure we update the local data
                if (idx >= this.actionList.length) {
                  this.$store.commit('setMessage', 'Plan Activities sequence updated.')
                  this.$store.commit('setLoading', false)
                }
              })
          }
          if (idx >= this.actionList.length) {
            this.$store.commit('setLoading', false)
          }
        })
      },

      getScriptureRefText (label) {
        let lblArr = label.split(';')
        let text = ''
        lblArr.forEach(bRef => {
          if (this.scriptureRefs.hasOwnProperty(bRef))
            text += this.scriptureRefs[bRef]
        })
        return text || 'loading...'
      },

      addScriptureRefItem () {
        this.$store.dispatch('addActionItemToPlan', {
          planId: this.plan.id,
          type: 'read',
          value: this.dialog.value,
          seqNo: this.insertBefore
        })
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

      sortActionList () {
        this.plan.actionList = this.actionList.sort((elemA, elemB) => elemA.seqNo - elemB.seqNo)
      },
    },

    created () {
      this.$store.dispatch('hideDialog')
      // set initial location where new activities will be added
      this.insertBefore = this.activitiesCount
    },

    mounted () {
      // initialize the actionListCount watcher
      this.oldActionListCount = this.activitiesCount
      // if a song was just added to this plan, dialog contains our plan id
      // and the dialog.seqNo can be used to set the insert marker
      if (this.dialog.selectedPlan === this.plan.id && this.dialog.seqNo) {
        this.insertBefore = this.dialog.seqNo
      }
    },

    watch: {
      dialog (val) {
        if (val.field === 'scriptureRef' && val.value) {
          this.addScriptureRefItem()
        }
      },

      // if an activity item was added or removed, make
      // sure the sequence numbers are still correct
      actionList (val) {
        if (this.oldActionListCount !== this.activitiesCount) {
          // also, if an item was added, move the insertion indicator
          if (this.oldActionListCount < this.activitiesCount) {
            this.insertBefore += 1
            this.needToMove = true // trigger the move of the indicator after the re-render
          }
          this.correctAllSeqNos()
          this.oldActionListCount = this.activitiesCount
        }
      }
    },

    updated () {
      // see if the indicator needs to move after the list of activities was re-rendered
      if (this.needToMove) {
        this.moveInsertIndicator()
        this.needToMove = false
      }
    }
  }

</script>
