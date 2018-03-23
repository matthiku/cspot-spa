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
            v-model="presentation.selectedTab"
            dark color="black"
            slider-color="yellow"
            show-arrows
          >
          <v-tab ripple>Lyrics Title</v-tab>

          <v-tab ripple>Lyrics Text</v-tab>

          <v-tab ripple>Scripture Text</v-tab>

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
import FontSetup from './FontSetup'

export default {
  components: {FontSetup},

  data () {
    return {
      menu: false,
      active: null,
      radioGroup: 1,
      switch1: true,
      checkbox: true,
      versesPerSlide: 0
    }
  },

  computed: {
    presentation () {
      return this.$store.getters.presentation      
    }
  },

  // map all global settings to the local data
  mounted () {
    this.versesPerSlide = this.presentation.versesPerSlide || 5
  },

  // when the local data changes, reflect it back to the global store
  watch: {
    versesPerSlide (val) {
      this.$store.commit('setVersesPerSlide', this.versesPerSlide)
    }
  }
}
</script>