<template>
  <v-container fluid>
    <v-flex xs12
        v-if="plans !== 'loading'"
        v-for="plan in filteredPlans" 
        :key="plan.id"
      >
      <v-card class="accent lighten-1 mb-2">
        <v-container fluid class="pa-0">
          <v-layout row>

            <!-- show title, date and location -->
            <v-flex>
              <v-card-title primary-title class="my-0 py-0">

                <div @click="showSinglePlan(plan.id)" class="cursor-pointer">   

                  <h2 class="white--text mb-0">
                    {{ plan.date | dateShort }}<span v-if="plan.date_end">-{{ plan.date_end | time }}</span> - 
                    <span style="font-style: italic;">
                      {{ types instanceof Object && types[plan.type_id] ? types[plan.type_id].name : plan.type_id }}
                    </span>
                  </h2>

                  <div>
                    <strong>Staff: </strong>
                    <app-show-staff-chips :single-plan="plan"></app-show-staff-chips>

                    <span v-if="plan.items">
                      {{ plan.items instanceof Object ? plan.items.length : 0 }} items</span>
                    <small v-else>(empty plan)</small>
                    
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

    <v-flex xs12 v-else>Loading...</v-flex>
    
  </v-container>
</template>

<script>
import genericMixins from '../../../mixins/'
import planMixins from '../mixins'

export default {
  name: 'ListSinglePlan',

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
