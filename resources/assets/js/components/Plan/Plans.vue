<template>
  <v-container fluid grid-list-xl>

    <!-- Show upcoming plans -->
    <v-layout row justify-center>
      <v-flex sm12 md11 lg10 xl9>
        <v-card>
          <v-card-text>

            <!-- show a form to filter the list of plans -->
            <v-expansion-panel>
              <v-expansion-panel-content 
                  v-model="showFilter"
                  class="primary white--text">
                <div slot="header" title="click to open">
                  <v-container fluid class="ma-0 pa-0">
                    <v-layout>
                      <v-flex xs6 class="headline">{{ pageTitle }}</v-flex>
                      <v-flex xs6 class="text-xs-right lh-3">More ...</v-flex>
                    </v-layout>
                  </v-container>
                </div>
                <v-card>
                  <v-card-text>
                    <app-show-plans-filter
                        v-on:closeFilterPanel="showFilter = false"
                      >
                    </app-show-plans-filter>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
            

            <!-- show the filtered list of plans -->
            <v-container>
              <v-layout row wrap>

                <v-flex xs12 mb-2 v-if="(!plans.length && !loading) || plans === 'loading'">
                  <span v-if="plans === 'loading'">Loading plans ...</span>
                  <span v-else>
                    There are no Plans.<br>
                    <v-btn v-if="userIsAdmin" :to="{name: 'createplan'}">Create one!</v-btn>
                  </span>
                </v-flex>


                <!-- show events in a calendar -->
                <app-show-plans-calendar
                    :types="types"
                  >
                </app-show-plans-calendar>


                <!-- show events as a list -->
                <app-show-list-of-plans
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
import planMixins from './mixins'

export default {
  name: 'AllPlansList',

  mixins: [genericMixins, planMixins],

  data () {
    return {
      pageTitle: 'Your Plans',
      showCalendar: true,
      showFilter: false
    }
  },

  destroy () {
    this.$off('closeFilterPanel')
  },

  watch: {
    search (val) {
      if (val.dialog && val.dialog.hasOwnProperty('show')) {
        this.showFilter = val.dialog.show
      }
      let who, what
      if (val.filter && this.users && this.types) {
        if (val.filter.user === '*') {
          who = 'All' 
        } else if (val.filter.user === this.user.id) {
          who = 'Your'
        } else {
          who = this.users[val.filter.user].name + '\'s'
        }
        if (val.filter.type === '*') {
          what = 'Plans' 
        } else if (!isNaN(val.filter.type)) {
          what = this.types[val.filter.type].name + 's'
        }
        this.pageTitle = who + ' ' + what
      }
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
