<template>
  <span>

      <h3 class="presentation-slide hidden">{{ item.title }}</h3>

      <div v-for="(part, index) in verse"
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
      verse: []
    }
  },

  created () {
    let parts
    // use the default lyrics text if no onsong data is available
    if (this.item && this.item.onsongs && !this.item.onsongs.length && this.item.lyrics) {
      // divide the lyrics into single lines first to find 
      // content which indicates a new slide (e.g. verse numbers or blank lines)
      parts = this.item.lyrics.split('\r\n')
      let slide = ''
      parts.forEach(line => {
        if (line.trim() !== '' && line.indexOf('[') < 0) {
          slide += line + '\r\n'
        } else if (slide !== '') {
          this.verse.push(slide)
          slide = ''
        }
      })
    }
    if (this.item && this.item.onsongs && this.item.onsongs.length) {
      this.item.onsongs.forEach(part => this.verse.push(part.text))
    }
  }
}
</script>
