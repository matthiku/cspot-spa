<!-- 

    Show List of (Upcoming) Plans

    DESCRIPTION
        Initially shows list of upcoming plans for the current user
        For admins, show all plans

    COMPONENTS:
        View\Plansfilter.vue      Provides a form to filter which plans should be listed
        View\PlansCalendar.vue    Shows filtered plans in a Calendar grid
        View\PlansList.vue        Shows filtered plans as a list

-->

<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">

      <!-- Show upcoming plans -->
      <v-card class="elevation-7">
        <v-card-text>

          <!-- show a form to filter the list of plans -->
          <v-expansion-panel>
            <v-expansion-panel-content 
                v-model="showFilter"
                class="primary white--text">

              <div slot="header" class="plans-list-header" title="click to open">
                <v-container fluid class="ma-0 pa-0">
                  <v-layout>

                    <v-flex xs6>
                      <span class="headline">{{ pageTitle }}</span>
                      <span v-if="filteredPlans">({{ filteredPlans.length }})</span>
                    </v-flex>

                    <v-flex xs6>
                      <v-chip
                          title="Show/Hide Calendar"
                          color="teal"
                          @click.stop="switchCalendar"
                          text-color="white">
                        <v-avatar>
                          <v-icon class="white--text">date_range</v-icon>
                        </v-avatar>
                        <span v-if="!showCalendar">Show</span>
                        <span v-else>Hide</span>
                        &nbsp;Calendar
                      </v-chip>
                    </v-flex>

                    <v-flex xs6 class="text-xs-right lh-3">
                      <span v-if="!showFilter">More</span>
                      <span v-else>Less</span> ...
                    </v-flex>
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

            <v-expansion-panel-content
                v-model="showCalendar">

              <!-- show events in a calendar -->
              <app-show-plans-calendar :types="types">
              </app-show-plans-calendar>
              
            </v-expansion-panel-content>
          </v-expansion-panel>
          

          <!-- show the filtered list of plans -->
          <v-container>
            <v-layout row wrap>

              <v-flex v-if="(!plans.length && !loading) || plans === 'loading'"
                  class="text-xs-center"
                  xs12 mb-2 
                >
                <span v-if="plans === 'loading'">
                  <v-progress-circular indeterminate :width="3" color="red"></v-progress-circular>
                  Loading plans ...
                </span>
                <span v-else>
                  There are no Plans.<br>
                  <v-btn v-if="userIsAdmin" :to="{name: 'createplan'}">Create one!</v-btn>
                </span>
              </v-flex>



              <!-- show events as a list -->
              <app-show-list-of-plans
                  v-if="plans !== 'loading'"
                >
              </app-show-list-of-plans>


            </v-layout>
          </v-container>

        </v-card-text>
      </v-card>

    </v-slide-y-transition>
  </v-container>
</template>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.lh-3 {
  line-height: 3;
}
.expansion-panel__header > .header__icon > .material-icons {
  color: white !important;
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
    },
    showFilter () {
      this.showCalendar = !this.showFilter
    }
  },

  computed: {
    filteredPlans () {
      return this.$store.getters.filteredPlans
    }
  },

  methods: {
    switchCalendar () {
      this.showCalendar = !this.showCalendar
    }
  }
}
</script>
