<template>
  <span>

    <v-layout row wrap justify-space-between>
      <v-flex xs9>
        <v-slider label="Text Size:" class="mb-0 pa-0" v-model="fontSize" min="15" max="70"></v-slider>
      </v-flex>
      <v-flex xs2>
        <v-chip outline>{{ fontSize }}</v-chip>
      </v-flex>
    </v-layout>
    <v-divider class="mt-1 mb-2"></v-divider>

    <v-layout row wrap justify-space-between>
      <v-flex xs8>
        <span class="input-group input-group--slider">
          <label>Text Color:</label>
        </span>
      </v-flex>
      <v-flex xs2>
        Basic
        <swatches
            v-model="colour"
            colors="basic"
            popover-to="left"
            row-length="7"
          ></swatches>
      </v-flex>
      <v-flex xs2>
        Advanced
        <swatches
            v-model="colour"
            colors="material-light"
            popover-to="left"
            row-length="7"
          ></swatches>
      </v-flex>
    </v-layout>
    <v-divider class="mt-1 mb-2"></v-divider>

    <v-layout row wrap justify-space-between>
      <v-flex xs4>
        <v-switch
          :label="`Italic: ${italic.toString()}`"
          v-model="italic"
        ></v-switch>
      </v-flex>
      <v-flex xs4>
        <v-switch
          :label="`Bold: ${bold.toString()}`"
          v-model="bold"
        ></v-switch>
      </v-flex>
    </v-layout>
    <v-divider class="my-1"></v-divider>

    <v-layout row wrap justify-space-between>
      <v-flex xs8>
        <span class="input-group input-group--slider">
          <label>Text Alignement:</label>
        </span>                      
      </v-flex>
      <v-flex xs4>
        <v-radio-group v-model="align">
          <v-radio
            v-for="n in aligns"
            :key="n"
            :label="`Align ${n}`"
            :value="n"
          ></v-radio>
        </v-radio-group>
      </v-flex>
    </v-layout>

  </span>
</template>

<script>
import Swatches from 'vue-swatches'
import "vue-swatches/dist/vue-swatches.min.css"

export default {

  components: {Swatches},

  props: ['entity'],

  data () {
    return {
      bold: false,
      fontSize: 35,
      italic: false,
      colour: '#fff',
      align: 'center',
      aligns: ['left', 'center', 'right'],
    }
  },

  computed: {
    presentation () {
      return this.$store.getters.presentation      
    }
  },

  // map all global settings to the local data
  mounted () {
    let globalEntity = this.presentation[this.entity + 'Font']
    this.bold = globalEntity.bold === 'bold'
    this.align = globalEntity.align
    this.italic = globalEntity.italic === 'italic'
    this.colour = globalEntity.colour
    this.fontSize = globalEntity.size
  },

  // when the local data changes, reflect it back to the global store
  watch: {
    align (val) {
      this.$store.commit('setPresentationFont', {entity: this.entity, align: val})
    },
    colour (val) {
      this.$store.commit('setPresentationFont', {entity: this.entity, colour: val})
    },
    fontSize (val) {
      this.$store.commit('setPresentationFont', {entity: this.entity, fontSize: val})
    },
    italic (val) {
      this.$store.commit('setPresentationFont', {entity: this.entity, italic: val ? 'italic' : 'normal'})
    },
    bold (val) {
      this.$store.commit('setPresentationFont', {entity: this.entity, bold: val ? 'bold' : 'normal'})
    },
  }
}
</script>

<style>

</style>
