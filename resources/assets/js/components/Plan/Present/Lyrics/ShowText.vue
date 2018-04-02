<template>
  <transition name="fade">

      <!-- slide with just the title -->
      <h3 class="presentation-slide"
          :style="textTitleStyle"
          :class="slideClass"
          v-show="showText"
        >{{ item.title }}</h3>

  </transition>  
</template>


<script>
import genericMixins from '../../../../mixins/'
import planMixins from '../../mixins'

export default {
  name: 'ShowText',

  mixins: [genericMixins, planMixins],

  props: ['item', 'currentItemSeqNo', 'currentSlideNo'],

  data () {
    return {
      showText: false
    }
  },

  watch: {
    // this value is being set by the main Presentation component
    currentItemSeqNo (showSeqNo) {
      // showSeqNo: the item with this SeqNo needs to become visible now
      if (showSeqNo == this.item.seqNo && this.currentSlideNo <= 0) {
        // only show the title of this item if it was explicitly set
        if (this.item.showTitle) this.showText = true
        // publish the amount of slides for this PLAN ACTIVITY ITEM
        this.$store.commit('setPresentationItem', {item: 'numberOfSlides', value: 1})
        // put focus on main element for key and mouse events to work
        let elem = document.getElementById('item-seqno-' + showSeqNo)
        if (elem) elem.focus()
      }
    }
  },

  computed: {
    slideClass () {
      return 'slides-seqno-' + this.item.seqNo
    },
    textTitleStyle () {
      return {
        color: this.presentation.textTitleFont.colour,
        fontSize: this.presentation.textTitleFont.size + 'px',
        textAlign: this.presentation.textTitleFont.align,
        fontStyle: this.presentation.textTitleFont.italic,
        fontWeight: this.presentation.textTitleFont.bold
      }
    }
  }
}
</script>
