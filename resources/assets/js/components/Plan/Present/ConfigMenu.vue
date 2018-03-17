<template>
  <div class="text-xs-center">
    <v-menu
        bottom
        v-model="menu"
        :close-on-content-click="false"
      >
      <v-btn icon dark slot="activator">
        <v-tooltip top>
          <v-icon slot="activator">text_format</v-icon>
          <span>configuration menu</span>
        </v-tooltip>
      </v-btn>

      <v-card dark>

        <v-tabs
            dark color="black"
            slider-color="yellow"
            show-arrows
          >
          <v-tab ripple>Lyrics</v-tab>

          <v-tab ripple>Scripture</v-tab>

          <v-tab ripple>Generic</v-tab>


          <!-- LYRICS configuration -->
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-container fluid px-0>
                  <h4 class="mt-0 pt-0">Lyrics font configuration</h4>

                  Size: <v-chip outline>{{ lyricsFontSize }}</v-chip>
                  <v-slider class="ma-0 pa-0" v-model="lyricsFontSize" min="15" max="70"></v-slider>

                  <v-switch
                    :label="`Italics: ${switch1.toString()}`"
                    v-model="switch1"
                  ></v-switch>

                  <v-switch
                    :label="`Bold: ${switch1.toString()}`"
                    v-model="switch1"
                  ></v-switch>
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
                <v-container fluid px-0>
                  <v-checkbox
                    :label="`Checkbox 1: ${checkbox.toString()}`"
                    v-model="checkbox"
                  ></v-checkbox>
                  <v-radio-group v-model="radioGroup">
                    <v-radio
                      v-for="n in 3"
                      :key="n"
                      :label="`Radio ${n}`"
                      :value="n"
                    ></v-radio>
                  </v-radio-group>
                  <v-switch
                    :label="`Switch 1: ${switch1.toString()}`"
                    v-model="switch1"
                  ></v-switch>
                </v-container>
              </v-card-text>
            </v-card>
          </v-tab-item>

          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-container fluid px-0>
                  <v-checkbox
                    :label="`Checkbox 1: ${checkbox.toString()}`"
                    v-model="checkbox"
                  ></v-checkbox>
                  <v-radio-group v-model="radioGroup">
                    <v-radio
                      v-for="n in 3"
                      :key="n"
                      :label="`Radio ${n}`"
                      :value="n"
                    ></v-radio>
                  </v-radio-group>
                  <v-switch
                    :label="`Switch 1: ${switch1.toString()}`"
                    v-model="switch1"
                  ></v-switch>
                </v-container>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>

      </v-card>
    </v-menu>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        menu: false,
        active: 0,
        radioGroup: 1,
        switch1: true,
        checkbox: true,
        lyricsFontSize: 35,
        lyricsTitleFontSize: 50,
        lyricsTitleItalics: true,
        lyricsTitleBold: true,
        lyricsItalics: true,
        lyricsBold: true,
      }
    },

    computed: {
      presentation () {
        return this.$store.getters.presentation      
      }
    },

    mounted () {
      this.lyricsFontSize = this.presentation.lyricsFont.size
    },

    watch: {
      lyricsFontSize (val) {
        this.$store.commit('setLyricsFont', {lyricsFontSize: val})
      }
    }
  }
</script>