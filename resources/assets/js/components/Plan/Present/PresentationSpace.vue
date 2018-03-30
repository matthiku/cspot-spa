<template>
  <div
      class="presentation-space"
      :style="presentationStyle"
    >


    <span v-if="presentationType==='present'">
      <!-- SONG -->
      <present-lyrics
          v-if="item.type==='song'"
          :currentItemSeqNo="currentItemSeqNo"
          :currentSlideNo="currentSlideNo"
          v-on:keyPressed="keyPressed"
          :item="item"
        ></present-lyrics>


      <!-- READING -->
      <present-scripture 
          v-if="item.type==='read'"
          v-on:keyPressed="keyPressed"
          :currentSlideNo="currentSlideNo"
          :currentItemSeqNo="currentItemSeqNo"
          :item="item"
        ></present-scripture>


      <!-- READING -->
      <present-text
          v-if="item.type==='text'"
          v-on:keyPressed="keyPressed"
          :currentSlideNo="currentSlideNo"
          :currentItemSeqNo="currentItemSeqNo"
          :item="item"
        ></present-text>
    </span>


    <span v-if="presentationType==='chords'">
      <present-chords
          v-if="item.type==='song'"
          :item="item"
        ></present-chords>
    </span>

  </div>
</template>


<script>
import presentText from './lyrics/ShowText.vue'
import presentLyrics from './lyrics/ShowLyrics.vue'
import presentChords from './chords/ShowChords.vue'
import presentScripture from './lyrics/ShowScripture.vue'

export default {
  name: 'PresentationSpace',

  components: {
    presentScripture,
    presentLyrics,
    presentChords,
    presentText
  },

  props: ['item', 'currentItemSeqNo', 'currentSlideNo', 'presentationType'],

  computed: {
    presentation() {
      return this.$store.getters.presentation
    },

    slideBgColour () {
      return this.$store.getters.slideBgColour
    },

    presentationStyle () {
      return {
        'background-color': this.slideBgColour
      }
    }    
  },

  created () {
    // set background colour depending on presentation type
    let type = 'lyricsFont' // default for the lyrics presentation
    if (this.presentationType === 'chords') type = 'chordsFont'
    if (this.presentationType === 'music') type = 'musicFont'
    if (this.presentationType === 'lead') type = 'leadFont'
    this.$store.commit('setSlideBgColour', this.presentation[type].slideBgColour)
  },

  methods: {
    keyPressed (what) {
      this.$emit('keyPressed', what)
    }
  }
}
</script>
