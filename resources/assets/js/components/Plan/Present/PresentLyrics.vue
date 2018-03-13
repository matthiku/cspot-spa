<template>
  <span>

      <h3 class="lyrics-slide"
          :class="[firstSlide, slideClass]"
        >{{ item.title }}</h3>


      <div v-for="(part, index) in verses"
          :key="index"
          class="lyrics-slide hidden"
          :class="slideClass"
        >
        <div v-for="(line, index) in part"
            class="lyrics-line"
            :key="index"
          >
          <span v-if="hasInstructions(line)">
            <span class="red--text">{{ hasInstructions(line)[0] }}</span>
            {{ hasInstructions(line)[1] }}
          </span>
          <span v-else>{{ line }}</span></div>
      </div>

  </span>  
</template>

<style>
.lyrics-slide {
  height: 100%;
}
.lyrics-line {
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
}
</style>


<script>
import genericMixins from '../../../mixins/'
import planMixins from '../mixins'

export default {
  name: 'PresentLyrics',

  mixins: [genericMixins, planMixins],

  props: ['item'],

  data () {
    return {
      verses: [],
      isRegion2: false
    }
  },

  methods: {
    isRegionTwo (line) {
      // search for "REGION 2" in the text line
      var patt = /\[region\s*2\]/i
      if (patt.test(line)) {
        this.isRegion2 = true
      } else {
        this.isRegion2 = false
      }
      return this.isRegion2
    },
    /**
     * Looks for singing instructions at the beginning of the line indicated by simple brackets (xyz) 
     * 
     * returns false if none found or an array with the actual instructions and the rest of the line
     */
    hasInstructions (text) {
      var patt = /^\(.+\)/
      if (!patt.test(text)) return false
      // if matching text is found, split the line at the closing bracket
      let strings = text.split(')')
      if (!strings.length === 2) return false // not catering for more than 2 instruction blocks...
      strings[0] = strings[0] + ')'
      return strings
    },
    /**
     * @description: Create single slides from a block of text (multiple lines) 
     *               with emptly lines as separators
     *
     * @argument block (string) with possibly mulitple lines of text, 
     *                          possibly containing one or more empty lines
     *
     * @returns: (array) slides, each containing an array of text lines
     */
    splitByEmptyLine (block) {
      let output = []
      let slide = []
      let lines = block.split('\n')
      lines.forEach(line => {
        if (line.trim() !== '') {
          slide.push(line.trim())
        } else if (slide.length) {
          output.push(slide)
          slide = []
        } else {
          slide = []
        }
      })
      if (slide.length) output.push(slide)
      return output
    }
  },

  computed: {
    slideClass () {
      return 'slides-seqno-' + this.item.seqNo
    },
    firstSlide () {
      return this.presentation.showSeqNo === this.item.seqNo ? '' : 'hidden'
    }
  },

  mounted () {
    if (!this.item) return
    let parts

    // if song has OnSong data, it needs to be prepared accordingly
    if (this.item.onsongs && Object.keys(this.item.onsongs) && this.item.sequence) {
      /*
        The sequence attribute of a song contains the codes for the individual onsong parts.
        It determines the order and repetition of the song parts in the lyrics presentation.
        These codes are the index (id) for the songParts object in the Vuex store
        The id number of those codes are the name for each individual Onsong objects
      */
      let sequenceArr = this.item.sequence.split(',')
      sequenceArr.forEach(seq => {
        // intro, notes or meta parts must be ignored
        if ('smi'.indexOf(seq) >= 0) return
        if (!this.songParts.hasOwnProperty(seq)) return // song part code could not be found!

        let partId = this.songParts[seq].id
        if (!this.item.onsongs.hasOwnProperty(partId)) return

        // extract lyrics only from the OnSong data
        let lyrics = this.getLyricsFromOnsong(this.item.onsongs[partId].text)

        // check if lyrics contain a blank line, indicating a new slide
        let slides = this.splitByEmptyLine(lyrics)
        slides.forEach(slide => this.verses.push(slide))

        /** TODO:
         *
         * 1. How to handle singing instructions, e.g. '(men)' / '(women)'
         * 2. TWO REGIONS view, indicated by a line like "[region 2]"
         * 
         * => must all be handled in the view (template)
         */
      })
    }

    // song has only the plain-text lyrics
    else if (this.item.lyrics) {
      // divide the lyrics into single lines first to find 
      // content which indicates a new slide (e.g. verses numbers or blank lines)
      let song = this.item.lyrics
      // check which character(s) is/are used as line seperator
      let lines = song.split('\n')
      let slide = []
      lines.forEach(line => {
        if (line.trim() !== '' && line.indexOf('[') < 0) {
          slide.push(line)
        } else if (slide.length) {
          this.verses.push(slide)
          slide = []
        } else {
          slide = []
        }
      })
      // needed if song contains only one line!
      if (slide.length) this.verses.push(slide)
    }
    if (!this.verses.length) {
      this.verses.push('(no lyrics found for this song!)')
    }
  }
}
</script>
