<template>
  <v-container fluid>

    <v-flex xs12 text-xs-center>
      <span v-if="!filteredPlans.length">No</span>
      <span v-else>{{ filteredPlans.length }}</span>
      Plans found
    </v-flex>

    <v-flex xs12
        v-if="filteredPlans.length"
        v-for="plan in filteredPlans" 
        :key="plan.id"
      >
      <v-card class="accent lighten-1 mb-2">
        <v-container fluid class="pa-0">
          <v-layout row>

            <!-- show title, date and location -->
            <v-flex>
              <v-card-title primary-title class="my-0 py-0">

                <div title="click to open" 
                    @click="showSinglePlan(plan.id)"
                    class="cursor-pointer">   

                  <h2 class="white--text mb-0">
                    {{ plan.date | dateShort }}<span v-if="plan.date_end">-{{ plan.date_end | time }}</span> - 
                    <span style="font-style: italic;">
                      {{ types instanceof Object && types[plan.type_id] ? types[plan.type_id].name : plan.type_id }}
                    </span>
                  </h2>

                  <div>
                    <v-tooltip bottom v-if="plan.items">                      
                      <v-btn fab dark small color="primary" ma-0 slot="activator">
                        {{ plan.items instanceof Object ? plan.items.length : 0 }}
                      </v-btn>
                      <span><v-icon>list</v-icon> &nbsp; Activities</span>
                    </v-tooltip>
                    <small v-else>(empty plan or still loading)</small>
                    
                    <app-show-staff-chips :single-plan="plan"></app-show-staff-chips>

                  </div>

                  <div v-if="plan.info"><strong>Note: </strong>{{ plan.info }}</div>

                </div>

                <v-spacer></v-spacer>

                <v-btn 
                  @click="showSinglePlan(plan.id)"
                  :flat="!userOwnsPlan(plan)" 
                  :class="userOwnsPlan(plan) ? 'info' : ''">
                  <v-icon left>{{ userOwnsPlan(plan) ? 'edit' : 'arrow_forward' }}</v-icon>
                  {{ userOwnsPlan(plan) ? 'Edit' : 'View' }} Plan
                </v-btn>

              </v-card-title>
            </v-flex>

          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
    
  </v-container>
</template>


<script>
import genericMixins from '../../../mixins/'
import planMixins from '../mixins'

export default {
  name: 'PlansList',

  mixins: [genericMixins, planMixins],

  data () {
    return {
      unfilteredPlans: [],
      filteredPlans: []
    }
  },

  created () {
    if (this.$route && this.$route.name === 'home') {
      this.unfilteredPlans = this.$store.getters.futurePlans
      this.$store.commit('setSearch', {
        filter: {
          type: '*',
          user: this.user.id
        }
      })
    } else {
      this.unfilteredPlans = this.plans
    }
    this.filteredPlans = this.unfilteredPlans
  },

  watch: {
    search (val) {
      let type = parseInt(val.filter.type)
      let user = parseInt(val.filter.user)
      let plans = this.unfilteredPlans // start with the unfiltered set of plans
      // set the filter for TYPE
      if (type >= 0) {
        plans = plans.filter(plan => plan.type_id === type)
      }
      // set the filter for USER
      if (user >= 0) {
        plans = plans.filter(plan => this.userOwnsPlan(plan, user))
      }
      this.filteredPlans = plans
    }
  },

  methods: {
    showSinglePlan (id) {
      // navigate to single plan form
      this.$router.push({name: 'plan', params: {planId: id}})
    }
  }
}
</script>
