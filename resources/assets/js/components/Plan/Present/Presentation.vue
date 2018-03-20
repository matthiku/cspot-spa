<template>
  <v-container fluid
      v-if="plan instanceof Object && plan.hasOwnProperty('actionList')"

      class="text-xs-center light-blue--text text--lighten-5 presentation-space pa-0"
    >

    <div v-for="item in actionList" :key="item.seqNo"

        v-if="item.type==='song' || item.type==='read'"

        :id="'item-seqno-' + item.seqNo"

        @click.left="showNext()"
        @click.right.stop.prevent="showNext(-1)"
        @click.middle.stop.prevent="exitPresentation()"

        class="plan-action-item full-width full-height hidden"
      >

      <!-- show the current item -->
      <presentation-space
          :item="item"
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
  background-color: darkslategrey;
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

  props: ['itemId'],

  data () {
    return {
      showSlideNo: -1
    }
  },

  computed: {
    firstVisibleItem () {
      return this.plan.actionList.find(item => item.type !== 'text' && !item.forLeadersEyesOnly)
    }
  },

  created () {
    // make sure we have a plan
    if (!(this.plan instanceof Object)) {
      console.log('no plan found, returning to plans list')
      this.$router.push('/plans')
      return
    }
    // ... and the plan contains action items!
    if (this.plan && (!this.plan.hasOwnProperty('actionList') || !this.plan.actionList.length)) {
      this.$store.commit('setError', 'Cannot present, this plan has no actions!')
      this.exitPresentation()
      return
    }
    // remove the scrollbar on the right side
    let page = document.getElementsByTagName('html')[0]
    page.style.overflowY = 'hidden'
  },

  mounted () {
    // plan has items, but none of them are 'showable'
    if (!this.itemId && !this.firstVisibleItem) {
      console.warn('no showable items found in this plan')
      return
    }

    // start with the seqNo provided in the URL param or with the first showable item if omitted
    this.setPresentationSlide(this.itemId || this.firstVisibleItem.seqNo)

    // within the item, now un-hide the first slide
    // but wait until document is ready!
    setTimeout(() => {
      this.showNext()
    }, 500)
  },

  methods: {
    keyPressed (event) {
      console.log(event)
      if (event.code === 'Escape') this.exitPresentation()
      if (event.code === 'ArrowRight') this.showNext()
      if (event.code === 'ArrowLeft') this.showNext(-1)
      if (event.code === 'Space') this.showNext()
      if (event.code === 'Backspace') this.showNext(-1)
      if (event.code === 'Home') { // go to first valid slide
        this.setPresentationSlide(this.firstVisibleItem.seqNo)
        this.showSlideNo = -1
        this.showNext()
        return
      }
      if (event.code === 'End') { // go to last valid slide
        this.setPresentationSlide(this.plan.actionList.length - 1)
        this.showSlideNo = 0
        this.showNext(-1)
        return
      }
      if (event.code === 'PageUp' || event.code === 'ArrowUp') { // go to next slide
        this.gotoThisSlide(this.presentation.showSeqNo + 1)
        return
      }
      if (event.code === 'PageDown' || event.code === 'ArrowDown') { // go to previous slide
        this.gotoThisSlide(this.presentation.showSeqNo - 1, -1)
        return
      }
      if (event.code === 'go') {
        if (event.where === 'back') this.exitPresentation()
        if (event.where === 'nextSlide') this.showNext()
        if (event.where === 'prevSlide') this.showNext(-1)
        if (!isNaN(event.where)) this.gotoThisSlide(event.where)
      }
      //TODO: NumpadAdd/NumpadSubtract -> increase/decrease font size, Minus, ...
    },
    gotoThisSlide (seqNo, dir) {
      this.setPresentationSlide(seqNo)
      this.showSlideNo = -1
      this.showNext(dir || 1)      
    },
    exitPresentation () {
      this.showSlideNo = 0
      this.$router.go(-1) // go back to previous page
    },
    emptyPlan () {      
      console.warn('Document ready:', document.readyState, ' - No showable items found in this plan!', this.plan.actionList)
      this.$store.commit('setError', 'no showable items found in this plan')
      this.exitPresentation()
    },

    showCurrentItem () {
      // remove 'hidden' class from the whole element (item) with the currently active SeqNo
      let planItems = document.getElementsByClassName('plan-action-item')
      // console.log('SeqNo', this.presentation.showSeqNo, '- un-hide this item', planItems)
      for (let index = 0; index < planItems.length; index++) {
        const elem = planItems[index];
        if (elem.id === 'item-seqno-' + this.presentation.showSeqNo) {
          elem.classList.remove('hidden')
        } else {
          elem.classList.add('hidden') // make sure all other items are hidden
        }
      }
    },

    setPresentationSlide(seqNo) {
      this.$store.commit('setPresentationSlide', {showSeqNo: seqNo})
      this.showCurrentItem() // make the current item visible (remove the 'hidden' class)
    },

    getCurrentSlides(seqNo, dir) {
      if (seqNo < 0) seqNo = this.plan.actionList.length -1
      if (seqNo > this.plan.actionList.length) seqNo = 0
      if (this.plan.actionList.length === 1) seqNo = 1 // plan has only one item, no need to watch seqNo

      // find the next (resp. previous) non-empty item but make sure we do not run this endlessly on an empty plan
      let slides
      for (let index = 0; index <= this.plan.actionList.length; index++) {
        slides = document.getElementsByClassName('slides-seqno-' + seqNo)
        if (slides.length) break // next valid item found
        // debugger
        // console.log('SeqNo', seqNo, '- empty! Actions count:', this.plan.actionList.length, this.actionList.length)
        seqNo += dir
        if (seqNo < 0) seqNo = this.plan.actionList.length -1
        if (seqNo > this.plan.actionList.length) seqNo = 0
        if (this.plan.actionList.length === 1) seqNo = 1 // plan has only one item, no need to watch seqNo
      }
      this.setPresentationSlide(seqNo)
      if (!slides.length) {
        this.emptyPlan()
        return
      }
      return slides
    },

    showNext(dir) {
      // default direction is forward, -1 for backwards
      if (dir === undefined) dir = 1

      let activeSeqNo = this.presentation.showSeqNo
      if (isNaN(activeSeqNo) || activeSeqNo > this.plan.actionList.length) {
        this.emptyPlan()
        return
      }

      // increase the visible-slide-indicator but make sure we do not reach 'out-of-bounds'
      this.showSlideNo = this.showSlideNo + dir

      // get all slides of the currently shown sequence number (seqNo)
      let slides = this.getCurrentSlides(activeSeqNo, dir)
      // console.log('SeqNo:', activeSeqNo, '- un-hide slide number', this.showSlideNo)
      if (!slides || !slides.length) return

      // have we reached beyond the BEGINNING of the current item?
      if (this.showSlideNo < 0) {
        // ... then we need to go to the PREVIOUS Plan Activity Item
        activeSeqNo -= 1
        this.setPresentationSlide(activeSeqNo)
        slides = this.getCurrentSlides(activeSeqNo, dir)
        this.showSlideNo = slides.length -1
        // console.log('SeqNo:', activeSeqNo, '- showing PREVIOUS item, Slide number', this.showSlideNo)
      }

      // have we reached the END of the current item?
      if (this.showSlideNo >= slides.length) {
        // ... then we have to go to the NEXT Plan Activity Item
        activeSeqNo += 1
        this.setPresentationSlide(activeSeqNo)
        slides = this.getCurrentSlides(activeSeqNo, dir)
        this.showSlideNo = 0
        // console.log('SeqNo:', activeSeqNo, '- showing NEXT item, Slide number:', this.showSlideNo)
      }

      // look for the next slide to be shown and hide all others
      for (let index = 0; index < slides.length; index++) {
        const element = slides[index]
        if (index === this.showSlideNo) {
          // console.log('showing element', element)
          element.classList.remove('hidden')
        } else {
          element.classList.add('hidden')
        }
      }
    }    
  },

  destroyed () {
    // enable the scrollbar again - TODO: only remove the 'overflow' attribute!
    let page = document.getElementsByTagName('html')[0]
    page.removeAttribute('style')
  }

}
</script>
