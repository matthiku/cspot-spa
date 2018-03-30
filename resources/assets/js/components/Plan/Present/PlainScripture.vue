<template>
  <div>
    <div v-for="(ref, index) in verseBlocks" :key="index"
      >
      <div v-for="(verseBlock, idx) in ref" :key="idx"
          class="presentation-slide"
          :style="scriptureStyle"
          :class="slideClass"
          v-html="verseBlock"
        ></div>
    </div>
  </div>  
</template>


<script>
export default {
  name: 'ChordsScripture',

  props: ['item'],

  data () {
    return {
      verseBlocks: []
    }
  },

  computed: {
    presentation () {
      return this.$store.getters.presentation      
    },
    scriptureRefs() {
      return this.$store.state.plan.scriptureRefs
    },
    slideClass () {
      return 'slides-seqno-' + this.item.seqNo
    },
    scriptureStyle () {
      return {
        color: this.presentation.chordsScrFont.colour,
        fontSize: this.presentation.chordsScrFont.size + 'px',
        textAlign: this.presentation.chordsScrFont.align,
        fontStyle: this.presentation.chordsScrFont.italic,
        fontWeight: this.presentation.chordsScrFont.bold
      }
    }   
  },

  mounted () {
    this.formatSlide()
  },

  methods: {
    formatSlide () {
      // get all relevent scripture Refs and divide them into blocks of verses
      // These blocks form the actual slides.
      this.verseBlocks = [] // containing the actual verse blocks
      this.showSlides = []  // controls visibility of each block
      // a scripture reference might have other text or have 
      // multiple references - all separated by a semicolon
      let arBref = this.item.title.split(';')
      arBref.forEach(bRef => {
        let block = [] // defines a block of verses (or a slide)
        if (this.scriptureRefs.hasOwnProperty(bRef)) {
          let slide = '<h4>' + bRef + '</h4>' // write reference as first line
          // get an array of all verses for this reference
          let verses = this.scriptureRefs[bRef].split('\n')
          for (let index = 0; index < verses.length; index++) {
            slide += '<div>' + verses[index] + '</div>' // add the verse into the bucket
          }
          block.push(slide)
        }
        this.verseBlocks.push(block)
      })
    }
  }

}
</script>
