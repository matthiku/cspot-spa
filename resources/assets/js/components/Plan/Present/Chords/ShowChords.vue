<template>
  <span>

      <!-- show full song with chords on one page -->
      <div v-for="(part, index) in verses"
          :key="index"
          :class="slideClass"
          :style="chordsStyle"
        >
        <h3 :class="'chords-part-id-' + part.meta.id">{{ part.meta.name }}</h3>
        <div v-for="(line, index) in part.song" :key="index">
          <pre>{{ line.chords }}</pre>
          <pre>{{ line.lyrics }}</pre>
        </div>
      </div>
  </span>  
</template>


<script>
import genericMixins from '../../../../mixins/'
import planMixins from '../../mixins'
import ChordSheetJS from 'chordsheetjs'

export default {
  name: 'PresentChords',

  mixins: [genericMixins, planMixins],

  props: ['item', 'currentItemSeqNo', 'currentSlideNo'],

  data () {
    return {
      verses: []
    }
  },

  computed: {
    slideClass () {
      return 'slides-seqno-' + this.item.seqNo
    },
    chordsStyle () {
      return {
        color: this.presentation.chordsFont.colour,
        fontSize: this.presentation.chordsFont.size + 'px',
        textAlign: this.presentation.chordsFont.align,
        fontStyle: this.presentation.chordsFont.italic,
        fontWeight: this.presentation.chordsFont.bold
      }
    }
  },

  methods: {
    /* ChordSheetJSObject - as created by ChordProParser
        this object contains an array of "lines"
        these lines are objects which contain arrays of "items"
        these items contain object with single chords and the corresponding lyrics text

      return: array of objects with complete lines of lyrcis and chords 
    */ 
    combineChordsAndLyrcis (ChordSheetJSObject) {
      let block = []
      if (ChordSheetJSObject.hasOwnProperty('lines')) {
        ChordSheetJSObject.lines.forEach((line) => {
          let lyrics = ''
          let chords = ''
          line.items.forEach((elem) => {
            let lyLen = elem.lyrics.length + 1 // min. one space after the chords
            let chLen = elem.chords.length
            let maxLen = Math.floor(lyLen, chLen)
            lyrics += elem.lyrics.padEnd(maxLen, ' -')
            chords += elem.chords.padEnd(maxLen)
          })
          block.push({lyrics, chords})
        })
      }
      return block
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
      const parser = new ChordSheetJS.ChordProParser()
      sequenceArr.forEach(seq => {
        if (!this.songParts.hasOwnProperty(seq)) return // song part code could not be found!

        let partId = this.songParts[seq].id

        // skip sequences that are not found in the onsong data
        if (!this.item.onsongs.hasOwnProperty(partId)) return

        let obj = {
          meta: {
            name: this.songParts[seq].name,
            id: partId
          }
        }

        // extract lyrics only from the OnSong data
        let song = parser.parse(this.item.onsongs[partId].text)
        obj.song = this.combineChordsAndLyrcis(song)
        this.verses.push(obj)
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
