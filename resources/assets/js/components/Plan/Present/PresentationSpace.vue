<template>
  <span>

    <!-- SONG -->
    <present-lyrics
        v-if="item.type==='song'"
        :item="item"
        :currentItemSeqNo="currentItemSeqNo"
        :currentSlideNo="currentSlideNo"
      ></present-lyrics>


    <!-- READING -->
    <present-scripture 
        v-if="item.type==='read'"
        :item="item"
        :currentSlideNo="currentSlideNo"
        :currentItemSeqNo="currentItemSeqNo"
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

  props: ['item', 'currentItemSeqNo', 'currentSlideNo']
}
</script>
