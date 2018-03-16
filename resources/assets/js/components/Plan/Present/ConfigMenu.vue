<template>
  <div class="text-xs-center">
    <v-menu
        bottom
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
            v-model="active"
            dark color="black"
            slider-color="yellow"
            show-arrows
          >
          <v-tab ripple>
            Songs
          </v-tab>
          <v-tab ripple>
            Scripture
          </v-tab>
          <v-tab ripple>
            Generic
          </v-tab>
        
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
        active: 0,
        checkbox: true,
        radioGroup: 1,
        switch1: true
      }
    }
  }
</script>