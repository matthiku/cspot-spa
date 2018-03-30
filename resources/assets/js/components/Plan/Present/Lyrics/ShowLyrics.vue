<template>
  <span>

      <!-- slide with just the song title -->
      <h3 class="presentation-slide"
          :style="lyricsTitleStyle"
          :class="slideClass"
          v-show="showSongTitle"
        >{{ item.title }}</h3>

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
          <!-- check if we need to only draw a horiz. line -->
          <hr v-if="line === '<hr>'">

          <!-- check if the line contains singing instructions -->
          <span v-else-if="hasInstructions(line)">
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

<style>
.lyrics-line {
  font-family: 'Raleway', sans-serif;
}
</style>


<script>
import genericMixins from '../../../../mixins/'
import planMixins from '../../mixins'

export default {
  name: 'PresentLyrics',

  mixins: [genericMixins, planMixins],

  props: ['item', 'currentItemSeqNo', 'currentSlideNo'],

  data () {
    return {
      verses: [],
      showSongTitle: false,
      showSlides: [false]
    }
  },

  watch: {
    // this value is being set by the main Presentation component
    currentItemSeqNo (showSeqNo) {
      // showSeqNo: the item with this SeqNo needs to become visible now
      if (showSeqNo == this.item.seqNo && this.currentSlideNo <= 0) {
        // console.log('show title of this component has the current show item. Slide No:', this.currentSlideNo)
        this.showSongTitle = true
        // publish the amount of slides for this PLAN ACTIVITY ITEM
        this.$store.commit('setPresentationItem', {item: 'numberOfSlides', value: this.showSlides.length})
        // put focus on main element for key and mouse events to work
        let elem = document.getElementById('item-seqno-' + showSeqNo)
        if (elem) elem.focus()
      }
    },

    currentSlideNo (slideNo) {
      // determines which slide needs to become visible
      // provided this is the right Plan Activity Item
      if (this.currentItemSeqNo === this.item.seqNo) {
        // console.log('curr. SeqNo', this.item.seqNo, 'showing next slide', slideNo)
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
        // should the song title become visible?
        if (slideNo < 1) {
          this.showSongTitle = true
        } else {
          // this.showSlides[slideNo] = true
          this.$set(this.showSlides, slideNo-1, true)
        }
      }
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
    },
    lyricsTitleStyle () {
      return {
        color: this.presentation.lyricsTitleFont.colour,
        fontSize: this.presentation.lyricsTitleFont.size + 'px',
        textAlign: this.presentation.lyricsTitleFont.align,
        fontStyle: this.presentation.lyricsTitleFont.italic,
        fontWeight: this.presentation.lyricsTitleFont.bold
      }
    }
  },

  methods: {

    removeRegion2 (line) {
      return line.replace(/^\[region\s*2\]/i, '')
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
    }
  },

  mounted () {
    if (!this.item) return

    let parts
    // if song has OnSong data, it needs to be prepared accordingly, provided we also have the helper data
    if (this.item.onsongs && Object.keys(this.item.onsongs) && Object.keys(this.songParts)) {
      /*
        The sequence attribute of a song contains the codes for the individual onsong parts.
        It determines the order and repetition of the song parts in the lyrics presentation.
        These codes are the index (id) for the 'songParts' object in the Vuex store.
        The id number of those codes are the name for each individual Onsong object.
      */
      let sequenceArr
      // if there is no predefined sequence, we try to deduct it from the onsong part ids
      if (!this.item.sequence) {
        sequenceArr = Object.keys(this.item.onsongs)
      } else {
        sequenceArr = this.item.sequence.split(',')
      }
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
          this.showSlides.push(false)
        })
      })
    }

    // song has only the plain-text lyrics
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
