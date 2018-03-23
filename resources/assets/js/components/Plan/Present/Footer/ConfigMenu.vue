<template>
  <div class="text-xs-center">
    <v-menu left top
        v-model="menu"
        :close-on-content-click="false"
      >
      <v-btn fab small dark slot="activator">
        <v-tooltip right>
          <v-icon slot="activator">settings</v-icon>
          <span>configuration</span>
        </v-tooltip>
      </v-btn>

      <v-card style="min-height: 400px" dark>

        <v-tabs
            v-model="active"
            dark color="black"
            slider-color="yellow"
            show-arrows
          >
          <v-tab ripple>Lyrics Title</v-tab>
          <v-tab ripple>Lyrics Text</v-tab>

          <v-tab ripple>Scripture Text</v-tab>

          <v-tab ripple>Colours</v-tab>

          <!-- LYRICS TITLE configuration -->
          <v-tab-item>
            <v-card style="min-height: 350px" flat>
              <v-card-text>
                <v-container fluid px-0 class="my-0 py-0">

                  <v-layout row wrap justify-space-between>
                    <v-flex xs9>
                      <v-subheader>Text Color</v-subheader>
                    </v-flex>
                    <v-flex xs2>
                      <swatches
                          v-model="lyricsTitleColour"
                          colors="material-light"
                          popover-to="left"
                          row-length="7"
                        ></swatches>
                    </v-flex>
                  </v-layout>

                  <v-layout row wrap justify-space-between>
                    <v-flex xs9>
                      <v-slider label="Font size:" class="ma-0 pa-0" v-model="lyricsTitleFontSize" min="15" max="70"></v-slider>
                    </v-flex>
                    <v-flex xs2>
                      <v-chip outline>{{ lyricsTitleFontSize }}</v-chip>
                    </v-flex>
                  </v-layout>

                  <v-layout row wrap justify-space-around>
                    <v-flex xs4>
                      <v-switch
                        :label="`Italic: ${lyricsTitleItalic.toString()}`"
                        v-model="lyricsTitleItalic"
                      ></v-switch>
                    </v-flex>
                    <v-flex xs4>
                      <v-switch
                        :label="`Bold: ${lyricsTitleBold.toString()}`"
                        v-model="lyricsTitleBold"
                      ></v-switch>
                    </v-flex>
                  </v-layout>

                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small @click="menu = false">OK</v-btn>
              </v-card-actions>
            </v-card>
          </v-tab-item>

          <!-- LYRICS TEXT configuration -->
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-container fluid px-0 class="my-0 py-0">

                  <v-layout row wrap justify-space-between>
                    <v-flex xs9>
                      <v-subheader>Text Color</v-subheader>
                    </v-flex>
                    <v-flex xs2>
                      <swatches
                          v-model="lyricsColour"
                          colors="material-light"
                          popover-to="left"
                          row-length="7"
                        ></swatches>
                    </v-flex>
                  </v-layout>

                  <v-layout row wrap justify-space-between>
                    <v-flex xs9>
                      <v-slider label="Font size:" class="ma-0 pa-0" v-model="lyricsFontSize" min="15" max="70"></v-slider>
                    </v-flex>
                    <v-flex xs2>
                      <v-chip outline>{{ lyricsFontSize }}</v-chip>
                    </v-flex>
                  </v-layout>

                  <v-layout row wrap justify-space-around>
                    <v-flex xs4>
                      <v-switch
                        :label="`Italic: ${lyricsItalic.toString()}`"
                        v-model="lyricsItalic"
                      ></v-switch>
                    </v-flex>
                    <v-flex xs4>
                      <v-switch
                        :label="`Bold: ${lyricsBold.toString()}`"
                        v-model="lyricsBold"
                      ></v-switch>
                    </v-flex>
                  </v-layout>

                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small @click="menu = false">OK</v-btn>
              </v-card-actions>
            </v-card>
          </v-tab-item>


          <!-- SCRIPTURE TEXT configuration -->
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-container fluid px-0 class="my-0 py-0">
                  <v-layout row wrap>
                    <v-flex xs10>
                      <v-slider label="Font size:" class="ma-0 pa-0" v-model="scriptureFontSize" min="15" max="70"></v-slider>
                    </v-flex>
                    <v-flex xs2>
                      <v-chip outline>{{ scriptureFontSize }}</v-chip>
                    </v-flex>
                  </v-layout>

                  <v-layout row wrap>
                    <v-flex xs6>
                      <v-switch
                        :label="`Italic: ${switch1.toString()}`"
                        v-model="scriptureItalic"
                      ></v-switch>
                    </v-flex>
                    <v-flex xs-6>
                      <v-switch
                        :label="`Bold: ${switch1.toString()}`"
                        v-model="scriptureBold"
                      ></v-switch>
                    </v-flex>
                  </v-layout>
                  <v-divider light></v-divider>
                  <v-layout row wrap>
                    <v-flex xs10>
                      <v-slider label="Verses per Slide:" :min="1" :max="25" v-model="versesPerSlide"></v-slider>
                    </v-flex>
                    <v-flex xs2>
                      <v-text-field v-model="versesPerSlide" solo type="number"></v-text-field>
                    </v-flex>
                  </v-layout>

                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small @click="menu = false">OK</v-btn>
              </v-card-actions>
            </v-card>
          </v-tab-item>


          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-container fluid grid-list-md>
                  <v-layout row wrap>
                    <v-flex xs9>
                      <v-slider label="Verses per Slide" :min="1" :max="25" v-model="versesPerSlide"></v-slider>
                    </v-flex>
                    <v-flex xs3>
                      <v-text-field v-model="versesPerSlide" type="number"></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small @click="menu = false">OK</v-btn>
              </v-card-actions>
            </v-card>
          </v-tab-item>

        </v-tabs>

      </v-card>
    </v-menu>
  </div>
</template>

<script>
import Swatches from 'vue-swatches'
import "vue-swatches/dist/vue-swatches.min.css"

export default {
  components: {Swatches},

  data () {
    return {
      menu: false,
      active: null,
      radioGroup: 1,
      switch1: true,
      checkbox: true,

      lyricsFontSize: 35,
      lyricsTitleFontSize: 50,
      lyricsTitleItalic: false,
      lyricsTitleColour: null,
      lyricsTitleBold: false,
      lyricsItalic: false,
      lyricsColour: null,
      lyricsBold: false,

      scriptureFontSize: 35,
      scriptureItalic: false,
      scriptureColour: null,
      scriptureBold: false,

      versesPerSlide: 0
    }
  },

  computed: {
    presentation () {
      return this.$store.getters.presentation      
    }
  },

  mounted () {
    this.versesPerSlide = this.presentation.versesPerSlide || 5

    this.scriptureBold = this.presentation.scriptureFont.bold === 'bold'
    this.scriptureItalic = this.presentation.scriptureFont.italic === 'italic'
    this.scriptureColour = this.presentation.scriptureFont.colour
    this.scriptureFontSize = this.presentation.scriptureFont.size

    this.lyricsBold = this.presentation.lyricsFont.bold === 'bold'
    this.lyricsItalic = this.presentation.lyricsFont.italic === 'italic'
    this.lyricsColour = this.presentation.lyricsFont.colour
    this.lyricsFontSize = this.presentation.lyricsFont.size
    this.lyricsTitleBold = this.presentation.lyricsFont.titleBold === 'bold'
    this.lyricsTitleColour = this.presentation.lyricsFont.titleColour
    this.lyricsTitleItalic = this.presentation.lyricsFont.titleItalic === 'italic'
    this.lyricsTitleFontSize = this.presentation.lyricsFont.titleSize
  },

  watch: {
    versesPerSlide (val) {
      this.$store.commit('setVersesPerSlide', this.versesPerSlide)
    },
    lyricsColour (val) {
      this.$store.commit('setLyricsFont', {lyricsColour: val})
    },
    lyricsFontSize (val) {
      this.$store.commit('setLyricsFont', {lyricsFontSize: val})
    },
    lyricsColour (val) {
      this.$store.commit('setLyricsFont', {lyricsColour: val})
    },
    lyricsTitleFontSize (val) {
      this.$store.commit('setLyricsFont', {lyricsTitleFontSize: val})
    },
    lyricsBold (val) {
      this.$store.commit('setLyricsFont', {lyricsBold: val ? 'bold' : 'normal'})
    },
    lyricsTitleColour (val) {
      this.$store.commit('setLyricsFont', {lyricsTitleColour: val})
    },
    lyricsTitleBold (val) {
      this.$store.commit('setLyricsFont', {lyricsTitleBold: val ? 'bold' : 'normal'})
    },
    lyricsItalic (val) {
      this.$store.commit('setLyricsFont', {lyricsItalic: val ? 'italic' : 'normal'})
    },
    lyricsTitleItalic (val) {
      this.$store.commit('setLyricsFont', {lyricsTitleItalic: val ? 'italic' : 'normal'})
    },

    scriptureColour (val) {
      this.$store.commit('setScriptureFont', {scriptureColour: val})
    },
    scriptureFontSize (val) {
      this.$store.commit('setScriptureFont', {scriptureFontSize: val})
    },
    scriptureBold (val) {
      this.$store.commit('setScriptureFont', {scriptureBold: val ? 'bold' : 'normal'})
    },
    scriptureItalic (val) {
      this.$store.commit('setScriptureFont', {scriptureItalic: val ? 'italic' : 'normal'})
    }
  }
}
</script>