<template>
  <div
      :class="{'full-height': presentationType==='lyrics' || presentationType==='chords'}"
      :style="presentationStyle"
    >


    <!-- 
      LYRICS presentation
     -->
    <span v-if="presentationType==='lyrics'"
      v-show="!blankSlideActive">
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

      <!-- GENERIC TEXT -->
      <present-text
          v-if="item.type==='text'"
          v-on:keyPressed="keyPressed"
          :currentSlideNo="currentSlideNo"
          :currentItemSeqNo="currentItemSeqNo"
          :item="item"
        ></present-text>
    </span>


    <!--
      CHORDS presentation 
    -->
    <span v-if="presentationType==='chords'">
      <chords-chords
          v-if="item.type==='song'"
          :item="item"
          :presentationType="presentationType"
        ></chords-chords>

      <plain-scripture
          v-if="item.type==='read'"
          :item="item"
        ></plain-scripture>

      <div v-show="item.type==='text'">
        <h2 class="text-header">({{ item.title }})</h2>
      </div>
    </span>


    <!--
      LEADER's presentation 
    -->
    <span v-if="presentationType==='lead'">
      <chords-chords
          v-if="item.type==='song'"
          :item="item"
          :presentationType="presentationType"
        ></chords-chords>

      <plain-scripture
          v-if="item.type==='read'"
          :item="item"
        ></plain-scripture>

      <div v-show="item.type==='text'">
        <h2 class="text-header">({{ item.title }})</h2>
      </div>
    </span>

  </div>
</template>

<style>
.text-header {
  line-height: 2;
  min-height: 250px;
}
</style>



<script>
import presentText from './lyrics/ShowText.vue'
import chordsChords from './chords/ShowChords.vue'
import presentLyrics from './lyrics/ShowLyrics.vue'
import plainScripture from './PlainScripture.vue'
import presentScripture from './lyrics/ShowScripture.vue'

export default {
  name: 'PresentationSpace',

  components: {
    presentScripture,
    plainScripture,
    presentLyrics,
    chordsChords,
    presentText
  },

  props: ['item', 'currentItemSeqNo', 'currentSlideNo', 'presentationType', 'blankSlideActive'],

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
    },
  },

  watch: {
    currentSlideNo (val) {
      // console.log('presentationSpace: currentSlideNo changed!', val)
    },
    presentationType () {
      console.log('presentationSpace: presentationType changed')
      this.setBGcolour()
    }
  },

  created () {
    this.setBGcolour()
  },

  methods: {
    keyPressed (what) {
      this.$emit('keyPressed', what)
    },
    setBGcolour () {
      // set background colour depending on presentation type
      let type = 'lyricsFont' // default for the lyrics presentation
      if (this.presentationType === 'chords') type = 'chordsFont'
      if (this.presentationType === 'music') type = 'musicFont'
      if (this.presentationType === 'lead') type = 'leadFont'
      this.$store.commit('setSlideBgColour', this.presentation[type].slideBgColour)
    }
  }
}
</script>
