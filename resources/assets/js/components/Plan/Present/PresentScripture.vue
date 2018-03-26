<template>
  <span>

      <span v-for="(ref, index) in verses" :key="index"
        >
        <div v-for="(verseBlock, index) in ref" :key="index"
            v-show="showSlides[index]"
            class="presentation-slide"
            :style="scriptureStyle"
            :class="slideClass"
            v-html="verseBlock"
          ></div>
      </span>

  </span>  
</template>

<style>
</style>


<script>
import genericMixins from '../../../mixins/'
import planMixins from '../mixins'

export default {
  name: 'PresentScripture',

  mixins: [genericMixins, planMixins],

  props: ['item', 'currentItemSeqNo', 'currentSlideNo'],

  data () {
    return {
      verses: [],
      showSlides: []
    }
  },

  computed: {
    slideClass () {
      return 'slides-seqno-' + this.item.seqNo
    },
    scriptureStyle () {
      return {
        color: this.presentation.scriptureFont.colour,
        fontSize: this.presentation.scriptureFont.size + 'px',
        textAlign: this.presentation.scriptureFont.align,
        fontStyle: this.presentation.scriptureFont.italic,
        fontWeight: this.presentation.scriptureFont.bold
      }
    }   
  },

  watch: {
    'presentation.versesPerSlide' () {
      this.formatSlide()
    },

    // this value is being set by the main Presentation component
    currentItemSeqNo (showSeqNo) {
      // showSeqNo: the item with this SeqNo needs to become visible now
      if (showSeqNo == this.item.seqNo && this.currentSlideNo <= 0) {
        this.showSlides[0] = true
        console.log(this.showSlides, 'show title of this component has the current show item. Slide No:', this.currentSlideNo)
      }
    },

    currentSlideNo (slideNo) {
      // determines which slide needs to become visible
      // provided this is the right Plan Activity Item
      if (this.currentItemSeqNo === this.item.seqNo) {
        console.log('curr. SeqNo', this.item.seqNo, 'showing next slide', slideNo)
        // first, hide all slides
        this.showSongTitle = false
        // now hide all verses and parts
        for (let index = 0; index < this.showSlides.length; index++) {
          this.showSlides[index] = false
        }
        // check if requested slide is beyond the END of the current item
        if (slideNo >= this.showSlides.length) {
          this.$emit('keyPressed', {code: 'go', where: 'nextItem'})
          return
        }
        // check if requested slide is beyond the START of the current item
        if (slideNo < 0) {
          this.$emit('keyPressed', {code: 'go', where: 'prevItem'})
          return
        }
        // show the current slide
        this.$set(this.showSlides, slideNo, true)
      }
    }
  },

  mounted () {
    this.formatSlide()
  },

  methods: {
    formatSlide () {
      this.verses = []
      // a scripture reference might have other text or have 
      // multiple references - all separated by a semicolon
      let arBref = this.item.title.split(';')
      arBref.forEach(bRef => {
        let block = [] // defines a block of verses (or a slide)
        if (this.scriptureRefs.hasOwnProperty(bRef)) {
          let slide = '<h4>' + bRef + '</h4>' // write reference as first line
          // get an array of all verses for this reference
          let verses = this.scriptureRefs[bRef].split('\n')
          // create a new slide for every n verses
          let maxBucketSize = this.presentation.versesPerSlide
          let bucket = 0
          for (let index = 0; index < verses.length; index++) {
            slide += '<div>' + verses[index] + '</div>' // add the verse into the bucket
            bucket += 1
            // push the bucket as a new slide into the block
            if (bucket === maxBucketSize) {
              block.push(slide)
              this.showSlides.push(false) // initially, each verse block must be invisble
              slide = '<h4>' + bRef + '</h4>'
              bucket = 0
            }
          }
          if (bucket > 1) {
            block.push(slide)
            this.showSlides.push(false) // initially, each verse block must be invisble
          }
        }
        this.verses.push(block)
      })
    }
  }

}
</script>
