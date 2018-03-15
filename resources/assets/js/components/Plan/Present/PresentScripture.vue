<template>
  <span>

      <span v-for="(ref, index) in verses" :key="index"
        >
        <div v-for="(verseBlock, index) in ref" :key="index"
            class="presentation-slide hidden"
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

  props: ['item'],

  data () {
    return {
      verses: []
    }
  },

  mounted () {
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
            slide = '<h4>' + bRef + '</h4>'
            bucket = 0
          }
        }
        if (bucket > 1) {
          console.log(bucket, slide)
          block.push(slide)
        }
      }
      this.verses.push(block)
    })
    
  },

  methods: {
  },

  computed: {
    slideClass () {
      return 'slides-seqno-' + this.item.seqNo
    },
    firstSlide () {
      return this.presentation.showSeqNo === this.item.seqNo ? '' : 'hidden'
    }
  }
}
</script>
