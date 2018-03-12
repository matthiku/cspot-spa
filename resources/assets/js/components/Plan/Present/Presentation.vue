<template>
  <v-container fluid
      v-if="plan instanceof Object && plan.hasOwnProperty('actionList')"

      class="presentation-space pa-0"

      @click.left="showNext()"
      @click.right.stop.prevent="showNext(-1)"
      @click.middle.stop.prevent="exitPresentation()"
    >

    <div v-for="item in plan.actionList" :key="item.seqNo"

        v-if="item.type==='song' || item.type==='read'"

        :id="'item-seqno-' + item.seqNo"

        class="plan-activity-item full-width full-height hidden"
      >

      <!-- show the current item -->
      <presentation-space
          :item="item"
          v-on:keyPressed="keyPressed"
        ></presentation-space>

    </div>

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
  color: wheat;
  background-color: darkslategrey;
}
</style>


<script>
import presentationSpace from './PresentationSpace.vue'
import genericMixins from '../../../mixins/'
import planMixins from '../mixins'

export default {
  name: 'PlanPresentation',

  components: {
    presentationSpace
  },

  mixins: [genericMixins, planMixins],

  props: ['itemId'],

  data () {
    return {
      showSlideNo: 1
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
      this.$router.go(-1) // go back to previous page
      return
    }

    // remove the scrollbar on the right side
    let page = document.getElementsByTagName('html')[0]
    page.style.overflowY = 'hidden'
  },

  mounted () {
    // start with the seqNo provided in the URL param or with the first visible item if omitted
    this.setPresentationSlide(this.itemId || this.firstVisibleItem.seqNo)
  },

  methods: {
    keyPressed (event) {
      if (event.code === 'ArrowRight') this.showNext()
      if (event.code === 'ArrowLeft') this.showNext(-1)
      if (event.code === 'Space') this.showNext()
      if (event.code === 'Backspace') this.showNext(-1)
      if (event.code === 'Escape') this.exitPresentation()
      //TODO: Home, End, PageUp, PageDown, ArrowUp, ArrowDown, NumpadAdd, NumpadSubtract, Minus
      console.log(event)
    },
    exitPresentation () {
      this.showSlideNo = 0
      this.$router.go(-1) // go back to previous page
    },

    showCurrentItem () {
      // remove 'hidden' class from element with seqNo === presentation SeqNo
      let planItems = document.getElementsByClassName('plan-activity-item')
      console.log('trying to show item with seqno', this.presentation.showSeqNo)
      for (let index = 0; index < planItems.length; index++) {
        const elem = planItems[index];
        if (elem.id === 'item-seqno-' + this.presentation.showSeqNo) {
          elem.classList.remove('hidden')
        } else {
          elem.classList.add('hidden')
        }
      }
    },

    getCurrentSlides(seqNo) {
      return document.getElementsByClassName('slides-seqno-' + seqNo)
    },
    setPresentationSlide(seqNo) {
      this.$store.commit('setPresentationSlide', {showSeqNo: seqNo})
      this.showCurrentItem()
    },

    showNext(dir) {
      // default direction is forward, -1 for backwards
      if (dir === undefined) dir = 1

      let activeSeqNo = this.presentation.showSeqNo
      if (isNaN(activeSeqNo) || activeSeqNo > this.plan.actionList.length) {
        //TODO: show warning and go one page back in router history
        return
      }

      // get all slides of the currently shown sequence number (seqNo)
      let slides = this.getCurrentSlides(activeSeqNo)
      if (!slides.length) {
        activeSeqNo += dir
        this.setPresentationSlide(activeSeqNo)
        console.log('item was empty', activeSeqNo)
        //TODO: this.findNextVisibleItem()
      }

      // increase the visible-slide-indicator but make sure we do not reach 'out-of-bounds'
      this.showSlideNo = this.showSlideNo + dir
      console.log('going to next slide', this.showSlideNo)

      // have we reached beyond the BEGINNING of the current item?
      if (this.showSlideNo < 0) {
        console.log('going to previous item')
        // then we need to go to the PREVIOUS item
        activeSeqNo -= 1
        this.setPresentationSlide(activeSeqNo)
        slides = this.getCurrentSlides(activeSeqNo)
        this.showSlideNo = slides.length -1
      }

      // have we reached the END of the current item?
      if (this.showSlideNo >= slides.length) {
        console.log('going to next item')
        // then we have to go to the NEXT item
        activeSeqNo += 1
        this.setPresentationSlide(activeSeqNo)
        this.showSlideNo = 0
        slides = this.getCurrentSlides(activeSeqNo)
      }

      // look for the next slide to be shown and hide all others
      for (let index = 0; index < slides.length; index++) {
        const element = slides[index]
        if (index === this.showSlideNo) {
          element.classList.toggle('hidden')
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
