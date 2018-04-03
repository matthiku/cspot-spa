<template>
  <v-container fluid grid-list-md class="mb-4">
    <v-layout wrap justify-space-between class="pb-5 mb-2">

      <!-- show full song with chords on one page -->
      <v-flex :xs12="columns===1" :md6="columns===2" :lg4="columns===3" :xl3="columns===4"
          v-for="(part, index) in verses" :key="index"
          :class="slideClass"
          :style="chordsStyle"
        >

          <!-- show song part names -->
          <span v-if="part.meta && part.meta.code !== 'm' && !part.meta.already"
              class="title px-3 mt-2"
              :class="{
                primary: parseInt(part.meta.code) && presentationType==='chords', 
                info: isNaN(part.meta.code) && presentationType==='chords',
                'blue--text': presentationType!=='chords'
              }"
            >{{ part.meta.name 
          }}:</span>


          <show-chords-over-lyrics
              v-if="presentationType==='chords' && part.meta && part.meta.code !== 'm' && !part.meta.already"
              :part="part.songObj"
              :code="part.meta.code"
              :itemId="item.seqNo"
            >
          </show-chords-over-lyrics>

          <!-- show notes -->
          <span v-if="part.meta && part.meta.code === 'm' && presentationType==='chords'"
              class="red--text"
            >Note: {{ part.song 
          }}</span>


          <!-- show just lyrics for Leader's script -->
          <span v-else-if="presentationType==='lead' && part.meta && !part.meta.already" 
              v-for="(line, index) in part.song" :key="index">
            <div class="lyrics-line mb-2">{{ line.lyrics }}</div>
          </span>


          <!-- do not show repeating song parts, but just a reminder instead -->
          <span v-else-if="part.meta" class="parts-repeat ml-3">repeat 
            <v-chip small outline
                :class="{
                  primary: parseInt(part.meta.code) && presentationType==='chords', 
                  info: isNaN(part.meta.code) && presentationType==='chords',
                  'blue--text': presentationType!=='chords'
                }"
              >
              {{ part.meta.name }}
            </v-chip>;
          </span>


          <!-- no chords available! show simple lyrics -->
          <div v-if="!item.sequence">
            <span v-if="presentationType==='chords'">(no chords available!)</span>
            <h3 class="pl-3 mt-2">
              Part {{ index + 1 }}
            </h3>
            <pre v-for="(line, idx) in part" :key="idx"
                class="lyrics-line"
              >{{ line }}</pre>
          </div>

      </v-flex>


    </v-layout>
    <hr>
    <v-layout row justify-center>
      <v-flex xs10 sm8 md6 lg4 xl3>
        Set Columns:
        <v-btn fab small @click.stop="columns=1" title="1"><v-icon>looks_one</v-icon></v-btn>
        <v-btn fab small @click.stop="columns=2" title="2"><v-icon>pause</v-icon></v-btn>
        <v-btn fab small @click.stop="columns=3" title="3"><v-icon>view_week</v-icon></v-btn>
        <v-btn fab small @click.stop="columns=4" title="4"><v-icon>looks_4</v-icon></v-btn>
      </v-flex>
    </v-layout>
  </v-container>  
</template>


<style>
.chords-line {
  color: red;
  line-height: 1
}
.lyrics-line {
  line-height: 1
}
.parts-repeat {
  font-weight: bold;
}
</style>


<script>
import genericMixins from '../../../../mixins/'
import planMixins from '../../mixins'
import showChordsOverLyrics from './ShowChordsOverLyrics'
import ChordSheetJS from 'chordsheetjs'

export default {
  name: 'PresentChords',

  components: {
    showChordsOverLyrics
  },

  mixins: [genericMixins, planMixins],

  props: [
    'item',
    'currentItemSeqNo',
    'currentSlideNo',
    'presentationType'
  ],

  data () {
    return {
      verses: [],
      columns: 4
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
            let lyLen = elem.lyrics.length
            let chLen = elem.chords.length + 1
            let maxLen = Math.floor(lyLen, chLen)
            if (lyLen <= chLen) maxLen += 1 // force at least one space between chords
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

    // for the leader's script, show lyrics in just one column by default
    if (this.presentationType === 'lead') this.columns = 1

    // if song has OnSong data, it needs to be prepared accordingly, provided we also have the helper data
    if (this.item.onsongs && Object.keys(this.item.onsongs) && Object.keys(this.songParts) && this.item.sequence) {
      /*
        The sequence attribute of a song contains the codes for the individual onsong parts.
        It determines the order and repetition of the song parts in the lyrics presentation.
        These codes are the index (id) for the 'songParts' object in the Vuex store.
        The id number of those codes are the name for each individual Onsong object.
      */
      // first, push the Notes into the verses array, if any
      let notesId = this.songParts.m.id
      if (this.item.onsongs[notesId]) {
        this.verses.push({
          meta: {
            name: this.songParts.m.name,
            code: 'm'
          },
          song: this.item.onsongs[notesId].text
        })
      }

      let partsUsed = [] // remember which song parts are already shown in the chords

      let sequenceArr = this.item.sequence.split(',')
      const parser = new ChordSheetJS.ChordProParser()
      sequenceArr.forEach(seq => {
        if (!this.songParts.hasOwnProperty(seq)) return // song part code could not be found!

        let partId = this.songParts[seq].id

        // skip sequences that are not found in the onsong data
        if (!this.item.onsongs.hasOwnProperty(partId)) return

        // add attribute to indicate if a part has already been shown
        let already = false
        if (partsUsed.indexOf(seq) >= 0) already = true
        partsUsed.push(seq)

        let obj = {
          meta: {
            name: this.songParts[seq].name,
            code: this.songParts[seq].code,
            already
          }
        }

        // extract lyrics only from the OnSong data
        let song = parser.parse(this.item.onsongs[partId].text)
        obj.song = this.combineChordsAndLyrcis(song)
        obj.songObj = song
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
