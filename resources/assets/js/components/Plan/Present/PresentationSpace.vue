<template>
  <span
      tabindex="1" 
      v-on:keyup="keyPressed($event)"
    >

    <!-- SONG -->
    <present-lyrics
        v-if="item.type==='song'"
        :item="item"
      ></present-lyrics>


    <!-- READING -->
    <span v-if="item.type==='read'">

      <h3 class="presentation-slide"
          :class="{hidden: presentation.showSeqNo!==item.seqNo}"
        >{{ item.title }}</h3>

      <pre class="presentation-slide hidden">{{ 
        getScriptureRef(item.title) }}
      </pre>
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
