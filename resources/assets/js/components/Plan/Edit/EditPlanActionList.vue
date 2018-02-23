<template>
  <v-card>

    <!-- show plan activity items -->
    <v-card-text class="grey lighten-3 pb-1">
      <v-list two-line dense>

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

        <p class="text-xs-center ma-0">
          <span v-if="!plan.actionList || !plan.actionList.length">(no items added yet)</span>
        </p>
      </v-list>
    </v-card-text>

    <!-- action buttons to add activity items to this plan -->
    <app-edit-plan-action-buttons
        :insertAfter="insertAfter"
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
        insertAfter: -1,
        showMenu: false,
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
          actionId: key,
          field: 'comment',
          newValue: event.target.outerText
        }).then(() => {
          // stop the content editing
          event.srcElement.contentEditable = false
          event.srcElement.contentEditable = true
        })
      },

      setInsertIndicator (where) {
        // create a new LI element as InsertIndicator or (TODO!) get the existing one
        let kid = document.createElement('li')
        kid.classList.add('drop-insert-indicator')
        kid.setAttribute('id', 'insert-indicator')
        
        // get the <DIV> of the activity indicated by "where"
        let activityDiv = document.getElementById(`activity-item-${where}`)
        // initially, or when there are no action items, this will be null
        // then we have to append the indicator as last LI item in the UL
        if (activityDiv) {          
          // find the parent UL element
          let parentUL = activityDiv.parentElement.parentElement
          // insert the new LI before the current LI
          parentUL.insertBefore(kid, activityDiv.parentElement)        
        } else {
          // we need to get the last LI item so that we can get to the parent UL
          let activityDiv = document.getElementById(`activity-item-${where - 1}`)
          let parentUL = activityDiv.parentElement.parentElement
          // now we can append the InsertIndicator as last LI item in the UL
          parentUL.appendChild(kid)
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
        let idx = 0
        this.actionList.forEach((elem) => {
          // correct the seqNo
          elem.seqNo = idx++
          // report the change back to the backend DB
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
        })
      },

      getScriptureRefText (label) {
        if (this.scriptureRefs.hasOwnProperty(label))
          return this.scriptureRefs[label]
        return 'loading...'
      },

      addScriptureRefItem () {
        this.$store.dispatch('addActionItemToPlan', {
          planId: this.plan.id,
          type: 'read',
          value: this.dialog.value,
          seqNo: this.insertAfter
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
      this.insertAfter = this.activitiesCount
    },

    mounted () {
      // we only need an insert indicater if we already have some items...
      if (this.insertAfter > -1) {
        this.setInsertIndicator(this.insertAfter)
      }
    },

    watch: {
      dialog (val) {
        if (val.field === 'scriptureRef' && val.value) {
          this.addScriptureRefItem()
        }
      }
    }
  }

</script>
