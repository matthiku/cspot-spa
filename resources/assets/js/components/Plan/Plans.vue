<template>
  <v-container fluid grid-list-xl>

    <!-- Show upcoming plans -->
    <v-layout row justify-center>
      <v-flex sm12 md11 lg10 xl9>
        <v-card>
          <v-card-text>

            <v-expansion-panel>
              <v-expansion-panel-content v-model="showFilter" class="primary white--text">
                <div slot="header">
                  <v-container fluid class="ma-0 pa-0">
                    <v-layout>
                      <v-flex xs6 class="display-1">All Plans</v-flex>
                      <v-flex xs6 class="text-xs-right lh-3">(Click for filter selection)</v-flex>
                    </v-layout>
                  </v-container>
                </div>
                <v-card>
                  <v-card-text>
                    <app-show-plans-filter></app-show-plans-filter>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
            

            <v-container>
              <v-layout row wrap>

                <v-flex xs12 mb-2 v-if="(!plans.length && !loading) || plans === 'loading'">
                  <span v-if="plans === 'loading'">Loading plans ...</span>
                  <span v-else>
                    There are no Plans.<br>
                    <v-btn v-if="userIsAdmin" :to="{name: 'createplan'}">Create one!</v-btn>
                  </span>
                </v-flex>


                <!-- iterate through each registered plan -->
                <app-show-list-of-plans
                    :filter="filter"
                    v-if="plans !== 'loading'"
                  >
                </app-show-list-of-plans>


              </v-layout>
            </v-container>

          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

  </v-container>
</template>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.lh-3 {
  line-height: 3;
}
</style>


<script>
import genericMixins from '../../mixins/'

export default {
  name: 'AllPlansList',

  mixins: [genericMixins],

  data () {
    return {
      filter: [],
      showFilter: false,
      planMenuItems: [
        { icon: 'replay', action: 'refresh', title: 'Refresh Plan List' }
      ]
    }
  },

  computed: {
    plans () {
      return this.$store.getters.plans
    }
  },

  methods: {
    planAction (what) {
      if (what === 'refresh') {
        this.$store.dispatch('refreshPlans')
      }
    }
  }
}
</script>
