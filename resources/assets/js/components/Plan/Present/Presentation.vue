/**
 * Event Plan Presentations
 * 
 * Starting point for Lyrics/Chords/Music or Leader presentations
 * 
 * Imported SFCs:
 *    Presentation Space  - the actual presentation space
 *    Presentation Footer - shows titles and provides controls for items and slides
 *
 * All plan items are immediately rendered, but not shown yet, only the first one
 * Or, if the presentation was started with a specific Item sequence number, that item will be shown first
 * 
 * The imported Single File Components (SFCs) will receive the seq.no. of the currently
 * visible Item respective the number of the currently visible slide within that item
 * 
 * The SFCs can emit an event ('keyPressed') to control the progress of the presentation
 */
<template>
  <v-container fluid
      v-if="plan instanceof Object && plan.hasOwnProperty('actionList')"

      class="text-xs-center presentation-space pa-0"
      :style="presentationStyle"
    >

    <div v-for="item in actionList" :key="item.seqNo"

        :id="'item-seqno-' + item.seqNo"

        @click.left="showNext()"
        @click.middle.stop.prevent="exitPresentation()"
        @click.right.stop.prevent="showNext(-1)"

        tabindex="-1"
        v-on:keyup="keyPressed($event, item.seqNo)"

        class="plan-action-item full-width full-height"
        :class="{hidden: presentation.showSeqNo !== item.seqNo}"
      >

      <!-- show the current item -->
      <presentation-space
          :item="item"
          :presentationType="presentationType"
          :currentSlideNo="showSlideNo"
          :currentItemSeqNo="presentation.showSeqNo"
          v-on:keyPressed="keyPressed"
        ></presentation-space>

    </div>

    <presentation-footer
        :currentSlideNo="showSlideNo"
        :firstVisibleItem="firstVisibleItem"
        :currentItemSeqNo="presentation.showSeqNo"
        v-on:keyPressed="keyPressed"
      ></presentation-footer>

  </v-container>
</template>


<style>
.hidden {
  display: none;
}
.full-width {
  width: 100%;
}
.full-height {
  height: 100%;
}
.presentation-space {
  width: 100%;
  height: 100%;
}
.presentation-slide {
  height: 100%;
}
</style>


<script>
import presentationSpace from './PresentationSpace.vue'
import presentationFooter from './Footer/Footer'

import genericMixins from '../../../mixins/'
import planMixins from '../mixins'

export default {
  name: 'PlanPresentation',

  components: {
    presentationSpace,
    presentationFooter
  },

  mixins: [genericMixins, planMixins],

  // seqNo            the sequence number of the Activity Item that should be presented first
  // presentationType can be either 'present' (=default!), 'lead', 'chords' or 'music'
  props: ['seqNo', 'presentationType'],

  data () {
    return {
      showSlideNo: -1,
      blankShowed: false
    }
  },

  computed: {
    presentationStyle () {
      return {
        'background-color' : this.presentation.slideBgColour || '#000'
      }
    },
    firstVisibleItem () {
      if (this.plan && this.plan.actionList.find)
        return this.plan.actionList.find(item => !item.forLeadersEyesOnly)
    }
  },

  created () {
    // make sure we have a plan
    if (!(this.plan instanceof Object)) {
      console.warn('no plan found, returning to plans list')
      this.$router.push({name: 'nextsunday'})
      return
    }

    // ... and the plan contains action items!
    if (this.plan && (!this.plan.hasOwnProperty('actionList') || !this.plan.actionList.length)) {
      // TODO: disable the 'Present' links on the Plans Details page or enable 'impromptu' presentations!
      this.$store.commit('setError', 'Cannot present, this plan has no actions!')
      this.exitPresentation()
      return
    }

    // remove the scrollbar on the right side, but only for the Lyrics presentation
    let page = document.getElementsByTagName('html')[0]
    page.style.overflowY = this.presentationType === 'present'? 'hidden' : 'auto'
  },

  mounted () {
    // plan has items, but none of them are 'showable'
    if (!this.seqNo && !this.firstVisibleItem) {
      console.warn('no showable items found in this plan')
      return
    }

    // start with the seqNo provided in the URL param or with the first showable item if omitted
    if (this.seqNo) {
      // console.log('mounted - show specific item', this.seqNo)
      this.setPresentationSlide(this.seqNo)
    } else {
      // console.log('mounted - show firstVisibleItem', this.firstVisibleItem.seqNo)
      this.setPresentationSlide(this.firstVisibleItem.seqNo)
    }
    // within the item, now un-hide the first slide
    // but wait until document is ready!
    setTimeout(() => {
      // console.log('delayed showNext')
      this.showNext()
    }, 500)
  },

  methods: {
    keyPressed (event, seqNo) {
      console.log('keyPressed', event, seqNo)

      if (event.code === 'ArrowRight') this.showNext()
      if (event.code === 'ArrowLeft') this.showNext(-1)
      if (event.code === 'Backspace') this.showNext(-1)
      if (event.code === 'Escape') this.exitPresentation()
      if (event.code === 'Space') this.showNext()
      if (event.code === 'Home') this.gotoThisItem(this.firstVisibleItem.seqNo)
      if (event.code === 'End')  this.gotoThisItem(this.plan.actionList.length)
      if (event.code === 'PageUp' || event.code === 'ArrowUp') 
        this.gotoThisItem(this.presentation.showSeqNo - 1)
      if (event.code === 'PageDown' || event.code === 'ArrowDown')
        this.gotoThisItem(this.presentation.showSeqNo + 1)
      if (event.code === 'go') {
        if (event.where === 'back') this.exitPresentation()
        if (event.where === 'nextSlide') this.showNext()
        if (event.where === 'prevSlide') this.showNext(-1)
        if (event.where === 'nextItem') this.gotoThisItem(this.presentation.showSeqNo + 1)
        if (event.where === 'prevItem') this.gotoThisItem(this.presentation.showSeqNo - 1, -1)
        if (!isNaN(event.where)) this.gotoThisItem(event.where)
      }
      //TODO: NumpadAdd/NumpadSubtract -> increase/decrease font size, Minus, ...

    },

    gotoThisItem (seqNo, dir) {
      console.log('go to item with seqNo', seqNo)
      // wrap around the items list if necessary
      if (seqNo < 1) {
        seqNo = this.actionList.length
      }
      if (seqNo > this.actionList.length) {
        seqNo = 1
      }
      this.setPresentationSlide(seqNo)
      this.showSlideNo = -1
      this.showNext(dir || 1)      
    },

    exitPresentation () {
      this.showSlideNo = 0
      this.$router.go(-1) // go back to previous page
    },
    emptyPlan () {      
      console.warn('Document readyState -', document.readyState, ' - No showable items found in this plan!', this.plan.actionList)
      this.$store.commit('setError', 'no showable items found in this plan')
      this.exitPresentation()
    },


    // determine which Plan Activity Item to show next
    setPresentationSlide(seqNo) {
      // is this new Plan Activity item Seq.No. different the current one?
      if (this.presentation.showSeqNo !== seqNo) {
        // then reset the number of slides for this item
        this.$store.commit('setPresentationItem', {item: 'numberOfSlides', value: 1})
      }

      // check if the requested item is a 'showable' item
      let item = this.actionList.find(elem => elem.seqNo === seqNo)
      if (item.forLeadersEyesOnly) {
        // go to next item
        seqNo += 1
        // or go to first showable item if this was already the last one
        if (seqNo > this.actionList.length) {
          seqNo = this.firstVisibleItem.seqNo
        }
      }

      // set the current SeqNo in Store
      this.$store.commit('setPresentationItem', {item: 'showSeqNo', value: seqNo})

      // set focus again on the slide so that we can capture keyboard events
      let elem = document.getElementById('item-seqno-' + seqNo)
      if (elem) elem.focus()

      // prepare ConfigMenu depending on current item type
      item = this.actionList.find(elem => elem.seqNo === seqNo)
      let selectedTab = '4'
      if (item.type === 'text') selectedTab = '3'
      if (item.type === 'read') selectedTab = '2'
      if (item.type === 'song') selectedTab = '1'
      if (item.type === 'song' && this.showSlideNo < 1) selectedTab = '0'
      this.$store.commit('setPresentationItem', {item: 'selectedTab', value: selectedTab})
    },


    showNext(dir) {
      // default direction is forward, -1 for backwards
      if (dir === undefined) dir = 1

      let activeSeqNo = this.presentation.showSeqNo
      if (isNaN(activeSeqNo) || activeSeqNo > this.plan.actionList.length) {
        console.warn('showNext - seqNo invalid:', activeSeqNo)
        this.emptyPlan()
        return
      }

      // increase the visible-slide-indicator
      this.showSlideNo = this.showSlideNo + dir

      // check if this is still a valid slide number within the current item
      if (this.showSlideNo >= this.presentation.numberOfSlides || this.showSlideNo < 0) {
        this.showSlideNo = 0
        activeSeqNo += dir
        this.gotoThisItem(activeSeqNo)
        return
      }

      // always set focus on the slide so that we can capture keyboard events
      let elem = document.getElementById('item-seqno-' + activeSeqNo)
      // console.log('showNext -', activeSeqNo, elem)
      if (elem) elem.focus()

      // prepare ConfigMenu depending on current item type
      let item = this.actionList.find(elem => elem.seqNo === activeSeqNo)
      let selectedTab = '4'
      if (item.type === 'text') selectedTab = '3'
      if (item.type === 'read') selectedTab = '2'
      if (item.type === 'song') selectedTab = '1'
      if (item.type === 'song' && this.showSlideNo < 1) selectedTab = '0'
      this.$store.commit('setPresentationItem', {item: 'selectedTab', value: selectedTab})
    }    
  },

  watch: {
    'presentation.versesPerSlide' (niu, old) {
      if (niu === parseInt(old)) return
      // go back to first slide of an item when this number is being changed
      this.showSlideNo = -1
      this.showNext()
    },
  },

  destroyed () {
    // enable the scrollbar again - TODO: only remove the 'overflow' attribute!
    let page = document.getElementsByTagName('html')[0]
    page.removeAttribute('style')
    // console.log('presentation component destroyed');
    
  }

}
</script>
