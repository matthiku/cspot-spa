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
      <chords-chords
          v-if="item.type==='song'"
          :item="item"
        ></chords-chords>

      <chords-scripture
          v-if="item.type==='read'"
          :item="item"
        ></chords-scripture>

      <div v-show="item.type==='text'">
        <h2>({{ item.title }})</h2>
      </div>
    </span>

  </div>
</template>


<script>
import presentText from './lyrics/ShowText.vue'
import chordsChords from './chords/ShowChords.vue'
import presentLyrics from './lyrics/ShowLyrics.vue'
import chordsScripture from './chords/ShowScripture.vue'
import presentScripture from './lyrics/ShowScripture.vue'

export default {
  name: 'PresentationSpace',

  components: {
    presentScripture,
    chordsScripture,
    presentLyrics,
    chordsChords,
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
