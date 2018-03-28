<template>
  <span>

      <!-- slides for each song particle -->
      <div v-for="(part, index) in verses"
          :key="index"
          :class="slideClass"
          class="presentation-slide"
          v-show="showSlides[index]"
        >
        <div v-for="(line, index) in part"
            :key="index"
            class="lyrics-line"
            :style="lyricsStyle"
          >

          <!-- check if the line contains singing instructions -->
          <span v-if="hasInstructions(line)">
            <span class="red--text">{{ removeRegion2(hasInstructions(line)[0]) }}</span>
            <span :class="{'yellow--text': lineIsRegionTwo(line)}">{{ hasInstructions(line)[1] }}</span>
          </span>

          <!-- check if we are in region 2 -->
          <span v-else
              :class="{'yellow--text': lineIsRegionTwo(line)}"
            >{{ removeRegion2(line) }}</span>

        </div>
      </div>
  </span>  
</template>


<script>
import genericMixins from '../../../../mixins/'
import planMixins from '../../mixins'

export default {
  name: 'PresentChords',

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
    lyricsStyle () {
      return {
        color: this.presentation.lyricsFont.colour,
        fontSize: this.presentation.lyricsFont.size + 'px',
        textAlign: this.presentation.lyricsFont.align,
        fontStyle: this.presentation.lyricsFont.italic,
        fontWeight: this.presentation.lyricsFont.bold
      }
    }
  },

  methods: {

    removeRegion2 (line) {
      return line.replace(/^\[region\s*2\]/i, '')
    },

    lineIsRegionTwo (line) {
      // search for "REGION 2" in the text line (with or without the space character)
      var patt = /^\[region\s*2\]/i
      if (patt.test(line)) {
        return true
      }
      return false
    },

    isLyricsHeader (line) {
      var patt = /\[region\s*2\]/i
      if (patt.test(line)) return false
      var patt = /^\[/
      if (patt.test(line)) return true
      return false
    },

    /**
     * Looks for singing instructions at the beginning of the line indicated by simple brackets (xyz) 
     * 
     * returns false if none found or an array with the actual instructions and the rest of the line
     */
    hasInstructions (text) {
      var patt = /\(.+\)/
      if (!patt.test(text)) return false
      // if matching text is found, split the line at the closing bracket
      let strings = text.split(')')
      if (!strings.length === 2) return false // not catering for more than 2 instruction blocks...
      strings[0] = strings[0] + ')'
      return strings
    },

    /**
     * @description: Create single slides from a block of text (multiple lines) 
     *               with emptly lines as separators     *
     * @argument block (string) with possibly mulitple lines of text, 
     *                          possibly containing one or more empty lines     *
     * @returns: (array) slides, each containing an array of text lines
     */
    splitByEmptyLine (block) {
      let output = []
      let slide = []
      let lines = block.split('\n')
      let isRegion2 = false
      lines.forEach(line => {
        if (line.trim() !== '' && !this.isLyricsHeader(line)) {
          // ignore a leading dot (line is to be ignored in Chords view only)
          if (line.indexOf('.') === 0) line = line.substr(1)
          // check for Region 2 lines
          if (!isRegion2) {
            if (this.lineIsRegionTwo(line)) {
              isRegion2 = true
              line = '<hr>'
            }
          } else {
            line = '[Region 2]' + line
          }
          slide.push(line.trim())
        } else if (slide.length) {
          output.push(slide)
          slide = []
          isRegion2 = false
        } else {
          slide = []
          isRegion2 = false
        }
      })
      if (slide.length) output.push(slide)
      return output
    }
  },

  mounted () {
    if (!this.item) return

    let parts
    // if song has OnSong data, it needs to be prepared accordingly, provided we also have the helper data
    if (this.item.onsongs && Object.keys(this.item.onsongs) && Object.keys(this.songParts) && this.item.sequence) {
      /*
        The sequence attribute of a song contains the codes for the individual onsong parts.
        It determines the order and repetition of the song parts in the lyrics presentation.
        These codes are the index (id) for the 'songParts' object in the Vuex store.
        The id number of those codes are the name for each individual Onsong object.
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
        slides.forEach(slide => {
          this.verses.push(slide)
          this.showSlides.push(true)
        })
      })
    }

    // song has only the plain-text lyrics
    else if (this.item.chords) {
      // divide the chords into single lines first to find 
      // content which indicates a new slide (e.g. verses numbers or blank lines)
      let slides = this.splitByEmptyLine(this.item.chords)
      slides.forEach(slide => this.verses.push(slide))
    }
    else if (this.item.lyrics) {
      // divide the lyrics into single lines first to find 
      // content which indicates a new slide (e.g. verses numbers or blank lines)
      let slides = this.splitByEmptyLine(this.item.lyrics)
      slides.forEach(slide => this.verses.push(slide))
    }
    if (!this.verses.length) {
      this.verses.push(['- no lyrics found for this song! -'])
    }
  }
}
</script>
