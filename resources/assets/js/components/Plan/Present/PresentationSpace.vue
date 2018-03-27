<template>
  <span>

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
</template>


<script>
import presentText from './lyrics/ShowText.vue'
import presentLyrics from './lyrics/ShowLyrics.vue'
import presentScripture from './lyrics/ShowScripture.vue'

export default {
  name: 'PresentationSpace',

  components: {
    presentScripture,
    presentLyrics,
    presentText
  },

  props: ['item', 'currentItemSeqNo', 'currentSlideNo'],

  methods: {
    keyPressed (what) {
      this.$emit('keyPressed', what)
    }
  }
}
</script>
