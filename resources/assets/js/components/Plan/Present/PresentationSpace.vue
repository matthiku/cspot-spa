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
    <span v-if="item.type==='read'"
        tabindex="2"
        v-on:keyup="keyPressed($event)"
      >

      <h3 :class="[firstSlide, slideClass]"
        >{{ item.title }}</h3>

      <pre class="hidden"
          :class="slideClass"
        >{{ 
        getScriptureRef(item.title) }}</pre>
    </span>


  </span>  
</template>


<script>
import presentLyrics from './PresentLyrics.vue'
import genericMixins from '../../../mixins/'
import planMixins from '../mixins'

export default {
  name: 'PresentationSpace',

  mixins: [genericMixins, planMixins],

  components: {
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
    },
    getScriptureRef (str) {
      // a scripture reference might have other text or have 
      // multiple references - all separated by a semicolon
      let text = ''
      let arBref = str.split(';')
      arBref.forEach(bRef => {
        if (this.scriptureRefs.hasOwnProperty(bRef)) {
          text += this.scriptureRefs[bRef] + '\r'
        }
      })
      return text
    },
  }
}
</script>
