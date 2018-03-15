<template>
  <span
      tabindex="1" 
      v-on:keyup="keyPressed($event)"
    >

    <!-- SONG -->
    <present-lyrics
        v-if="item.type==='song'"
        :item="item"
        tabindex="2"
        v-on:keyup="keyPressed($event)"
      ></present-lyrics>


    <!-- READING -->
    <present-scripture 
        v-if="item.type==='read'"
        :item="item"
        tabindex="2"
        v-on:keyup="keyPressed($event)"
      ></present-scripture>


  </span>  
</template>


<script>
import presentLyrics from './PresentLyrics.vue'
import presentScripture from './PresentScripture.vue'
import genericMixins from '../../../mixins/'
import planMixins from '../mixins'

export default {
  name: 'PresentationSpace',

  mixins: [genericMixins, planMixins],

  components: {
    presentScripture,
    presentLyrics
  },

  props: ['item'],

  computed: {
    slideClass () {
      return 'slides-seqno-' + this.item.seqNo
    },
    firstSlide () {
      return this.presentation.showSeqNo === this.item.seqNo ? '' : 'hidden'
    }
  },

  methods: {
    keyPressed (event) {
      this.$emit('keyPressed', event)
    }
  }
}
</script>
