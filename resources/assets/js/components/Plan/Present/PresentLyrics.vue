<template>
  <span>

      <h3 class="presentation-slide hidden">{{ item.title }}</h3>

      <div v-for="(part, index) in verses"
          :key="index"
          class="presentation-slide hidden"
        >
        <pre>{{ part }}</pre>
      </div>

  </span>  
</template>


<script>
import genericMixins from '../../../mixins/'
import planMixins from '../mixins'

export default {
  name: 'PresentLyrics',

  mixins: [genericMixins, planMixins],

  props: ['item'],

  data () {
    return {
      verses: []
    }
  },

  mounted () {
    if (!this.item) return
    let parts

    // if song has OnSong data, it needs to be prepared accordingly
    if (this.item.onsongs && Object.keys(this.item.onsongs)) {
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
        if (!this.songParts.hasOwnProperty(seq)) return
        let partId = this.songParts[seq].id
        if (!this.item.onsongs.hasOwnProperty(partId)) return
        // extract lyrics only from the OnSong data
        let lyrics = this.getLyricsFromOnsong(this.item.onsongs[partId].text)
        //TODO:
        // 1. remove lines with musical instructions, e,g, "(no music)"
        // 2. How to handle singing insctructions, e.g. 'men' / 'women'
        // 3. blank lines must be treated as to start a new slide
        this.verses.push(lyrics)
      })
    }

    // song has only the plain-text lyrics
    else if (this.item.lyrics) {
      // divide the lyrics into single lines first to find 
      // content which indicates a new slide (e.g. verses numbers or blank lines)
      let song = this.item.lyrics
      // check which character(s) is/are used as line seperator
      parts = song.split('\n')
      let slide = ''
      parts.forEach(line => {
        if (line.trim() !== '' && line.indexOf('[') < 0) {
          slide += line + '\r\n'
        } else if (slide !== '') {
          this.verses.push(slide)
          slide = ''
        }
      })
      // needed if song contains only one line!
      if (slide) this.verses.push(slide)
    }
  }
}
</script>
