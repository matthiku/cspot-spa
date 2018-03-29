<template>
  <div class="text-xs-center">
    <v-menu left top lazy
        v-model="menu"
        :close-on-content-click="false"
      >
      <v-btn fab small dark slot="activator">
        <v-tooltip right>
          <v-icon slot="activator">settings</v-icon>
          <span>configuration</span>
        </v-tooltip>
      </v-btn>

      <v-card style="min-height: 500px" dark>

        <v-tabs
            v-model="activeTab"
            dark color="black"
            slider-color="yellow"
            show-arrows
          >
          <v-tab ripple>Lyrics Title</v-tab>

          <v-tab ripple>Lyrics Text</v-tab>

          <v-tab ripple>Scripture Text</v-tab>

          <v-tab ripple>Generic Text</v-tab>

          <v-tab ripple>Screen Setup</v-tab>


          <!-- LYRICS TITLE configuration -->
          <v-tab-item>
            <v-card flat>
              <v-card-text class="pb-0 mb-0">
                <v-container fluid px-0 class="mt-0 pt-0">

                  <font-setup entity="lyricsTitle"></font-setup>

                </v-container>
              </v-card-text>

              <v-card-actions class="pt-0">
                <v-spacer></v-spacer>
                <v-btn small @click="menu = false">OK</v-btn>
              </v-card-actions>
            </v-card>
          </v-tab-item>


          <!-- LYRICS TEXT configuration -->
          <v-tab-item>
            <v-card flat>
              <v-card-text class="pb-0 mb-0">
                <v-container fluid px-0 class="mt-0 pt-0">

                  <font-setup entity="lyrics"></font-setup>

                </v-container>
              </v-card-text>

              <v-card-actions class="pt-0">
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

                  <font-setup entity="scripture"></font-setup>

                  <v-divider class="my-0"></v-divider>
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


          <!-- GENERIC TEXT configuration -->
          <v-tab-item>
            <v-card flat>
              <v-card-text class="pb-0 mb-0">
                <v-container fluid px-0 class="mt-0 pt-0">

                  <font-setup entity="textTitle"></font-setup>

                </v-container>
              </v-card-text>

              <v-card-actions class="pt-0">
                <v-spacer></v-spacer>
                <v-btn small @click="menu = false">OK</v-btn>
              </v-card-actions>
            </v-card>
          </v-tab-item>



          <!-- generic presentation configuration -->
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-container fluid grid-list-md>

                  <v-layout row wrap justify-space-between>
                    <v-flex xs8>
                      <span class="input-group input-group--slider">
                        <label>Slides Background Color:</label>
                      </span>
                      <v-text-field
                        name="slideBgColour"
                        :value="slideBgColour"
                        v-model="slideBgColour"
                        label="Or enter the colour code:"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs2>generic
                      <swatches
                          v-model="slideBgColour"
                          colors="material-dark"
                          popover-to="left"
                          row-length="7"
                        ></swatches>
                    </v-flex>
                    <v-flex xs2>advanced
                      <swatches
                          v-model="slideBgColour"
                          colors="text-advanced"
                          popover-to="left"
                        ></swatches>
                    </v-flex>
                  </v-layout>
                  <v-divider class="mt-1 mb-2"></v-divider>


                  <v-layout row wrap>
                    <v-flex xs12>
                      Show Blank Slides between Plan Action Items?
                      <v-checkbox
                          class="pb-5 mb-5"
                          :label="`${blankSlide.toString()}`"
                          v-model="blankSlide"
                        ></v-checkbox>                      
                    </v-flex>
                  </v-layout>


                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small
                    @click="menu = false">OK</v-btn>
              </v-card-actions>
            </v-card>
          </v-tab-item>

        </v-tabs>

      </v-card>
    </v-menu>
  </div>
</template>

<script>
import FontSetup from './FontSetup'
import Swatches from 'vue-swatches'
import "vue-swatches/dist/vue-swatches.min.css"

export default {
  components: {FontSetup, Swatches},

  data () {
    return {
      menu: false,
      activeTab: null,
      versesPerSlide: 0,
      blankSlide: null,
      slideBgColour: '#e1f5fe'
    }
  },

  computed: {
    presentation () {
      return this.$store.getters.presentation      
    },
    setActiveTab () {
      return this.presentation.selectedTab.toString()
    }
  },

  // map all global settings to the local data
  created () {
    this.versesPerSlide = this.presentation.versesPerSlide || 5
    this.blankSlide = this.presentation.blankSlide || false
    this.slideBgColour = this.presentation.lyricsFont.slideBgColour || '#e1f5fe'
  },

  // when the local data changes, reflect it back to the global store
  watch: {
    setActiveTab (value) {
      this.activeTab = value
    },
    versesPerSlide (value) {
      this.$store.commit('setPresentationItem', {item: 'versesPerSlide', value})
    },
    blankSlide (value) {
      this.$store.commit('setPresentationItem', {item: 'blankSlide', value})
    },
    slideBgColour (value) {
      this.$store.commit('setPresentationItem', {item: 'slideBgColour', value})
    }
  }
}
</script>