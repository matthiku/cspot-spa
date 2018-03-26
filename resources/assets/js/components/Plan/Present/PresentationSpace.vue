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


  </span>  
</template>


<script>
import presentLyrics from './PresentLyrics.vue'
import presentScripture from './PresentScripture.vue'

export default {
  name: 'PresentationSpace',

  components: {
    presentScripture,
    presentLyrics
  },

  props: ['item', 'currentItemSeqNo', 'currentSlideNo'],

  methods: {
    keyPressed (what) {
      this.$emit('keyPressed', what)
    }
  }
}
</script>
