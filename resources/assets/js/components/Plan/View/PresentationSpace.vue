<template>
  <span>
    <!-- SONG -->
    <span v-if="item.type==='song'">
      <h3>{{ item.title }}</h3>
      <pre>{{ item.lyrics }}</pre>
    </span>

    <!-- READING -->
    <span v-if="item.type==='read'">
      <h3>{{ item.title }}</h3>
      <pre>{{ getScriptureRef(item.title) }}</pre>
    </span>

  </span>  
</template>


<script>
import genericMixins from '../../../mixins/'
import planMixins from '../mixins'

export default {
  mixins: [genericMixins, planMixins],

  props: ['item'],

  methods: {
    getScriptureRef (str) {
      // a scripture reference might have other text or have 
      // multiple references - all separated by a semicolon
      let text = ''
      let arBref = str.split(';')
      arBref.forEach(bRef => {
        if (this.scriptureRefs.hasOwnProperty(bRef)) {
          text += this.scriptureRefs[bRef] + '\r'
        }
      })
      return text
    },
  }
}
</script>
