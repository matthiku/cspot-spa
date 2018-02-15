<template>
  <v-container fluid grid-list-xl class="px-1">

    <!-- Show singe Plan -->
    <v-layout row justify-center>
      <v-flex md12 lg10 xl8 class="pa-0">
        <v-card>
          <v-card-text class="px-1 pb-0">

            <!-- TITLE area -->
            <app-show-plan-title-toolbar
                :plan="plan"
                :types="types"
                :pageTitle="pageTitle"
                :userIsAdmin="userIsAdmin"
              ></app-show-plan-title-toolbar>

            <!-- PLAN DETAILS -->
            <v-container class="pb-1">
              <v-layout row wrap>

                <v-flex xs12 class="px-0">
                  <v-card class="mb-2 px-0">
                    <v-container fluid fill-height>
                      <v-layout row>

                        <v-flex v-if="!plan" xs12>Plan missing or still loading...</v-flex>

                        <!-- show title, date and location -->
                        <v-flex v-else xs12 class="px-0 grey lighten-2">
                          <v-card-text class="mb-0 px-1 pt-1 pb-2">
                            <div>

                              <!-- Plan Date and Time with subtitle -->
                              <v-layout row wrap>
                                <v-flex sm12 md8 class="py-0">
                                  <h2 :class="[ userOwnsThisPlan ? 'mb-0' : 'mb-2']" @click="openEditDialog('date')"
                                    >{{ plan.date | date }}<span v-if="plan.date_end">-{{ plan.date_end | time }}</span>

                                    <app-edit-plan-date-time-dialog
                                        v-if="userOwnsThisPlan"
                                        :plan="plan">
                                    </app-edit-plan-date-time-dialog>

                                  </h2>
                                </v-flex>
                                <!-- "subtitle" -->
                                <v-flex sm12 md4 class="text-xs-center pt-0">
                                  <h4 v-if="plan.info" 
                                      :title="[ userOwnsThisPlan ? 'click to open editor' : '' ]"
                                      @click="openPlanSubtitleEdit"
                                      class="white-space-pre">{{ plan.info }}</h4>
                                </v-flex>
                              </v-layout>

                              <v-expansion-panel>

                                <!-- show and edit plan STAFF -->
                                <v-expansion-panel-content
                                    v-model="showDetails.staff" :class="[showDetails.staff ? 'green lighten-3' : '']">

                                  <div slot="header">
                                    <span class="body-2 mr-3">
                                      <v-icon class="mr-3">supervisor_account</v-icon>
                                      Staff <span v-if="plan.teams && plan.teams.length">({{ plan.teams.length }})</span>
                                    </span>

                                    <app-show-staff-chips v-if="!showDetails.staff" :single-plan="plan"></app-show-staff-chips>

                                    <v-tooltip bottom lazy
                                        v-if="!showDetails.staff"
                                      >
                                      <v-btn
                                          slot="activator"
                                          small outline 
                                          color="grey lighten-1"
                                          class="ml-4 my-0"
                                          @click.stop="showDetails.planDetails = !showDetails.planDetails">
                                        <span class="hidden-md-and-down">
                                          <span>{{ showDetails.planDetails ? 'hide' : 'show' }}&nbsp;</span>
                                        </span>
                                        plan details
                                      </v-btn>
                                      <span>show Plan subtitle, resources and notes</span>
                                    </v-tooltip>
                                  </div>

                                  <app-edit-plan-staff-list
                                      :planId="plan.id"
                                      :userOwnsThisPlan="userOwnsThisPlan"
                                    ></app-edit-plan-staff-list>

                                </v-expansion-panel-content>

                                <!-- show and edit plan INFO -->
                                <v-expansion-panel-content v-show="showDetails.planDetails || showDetails.staff"
                                    v-model="showDetails.info" :class="[showDetails.info ? 'green lighten-3' : '']">
                                  <div slot="header">
                                    <span class="body-2 mr-3"><v-icon class="mr-3">info</v-icon> Subtitle</span>
                                    <span v-if="!showDetails.info" class="caption">({{
                                        plan.info | sentenceMax(55, 'none')
                                      }})</span>
                                  </div>

                                  <app-edit-plan-info-field :plan="plan" :userOwnsThisPlan="userOwnsThisPlan"></app-edit-plan-info-field>

                                </v-expansion-panel-content>

                                <!-- show and edit plan RESOURCES -->
                                <v-expansion-panel-content v-show="showDetails.planDetails || showDetails.staff"
                                    v-model="showDetails.resources" :class="[showDetails.resources ? 'green lighten-3' : '']">
                                  <div slot="header">
                                    <span class="body-2 mr-3"><v-icon class="mr-3">event_seat</v-icon> Resources</span>
                                    <span v-if="!showDetails.resources" class="caption">(Room 1, Projector)</span></div>
                                  <v-card>
                                    <v-card-text class="grey lighten-3">
                                      resources, resources, resources
                                    </v-card-text>
                                  </v-card>
                                </v-expansion-panel-content>

                                <!-- show and edit plan NOTES -->
                                <v-expansion-panel-content  v-show="showDetails.planDetails || showDetails.staff"
                                    v-model="showDetails.notes" :class="[showDetails.notes ? 'green lighten-3' : '']">
                                  <div slot="header">
                                    <span class="body-2 mr-3"><v-icon class="mr-3">loyalty</v-icon> Notes</span>
                                    <span v-if="!showDetails.notes" class="caption">(none)</span>
                                  </div>
                                  <v-card>
                                    <v-card-text class="grey lighten-3">
                                      ...
                                    </v-card-text>
                                  </v-card>
                                </v-expansion-panel-content>

                                <!-- show and edit plan ACTIVITIES -->
                                <v-expansion-panel-content
                                    v-model="showDetails.activities" :class="[showDetails.activities ? 'green lighten-3' : '']">
                                  <div slot="header">
                                    <span class="body-2 mr-3">
                                      <v-icon class="mr-3">list</v-icon>
                                      Order of Service
                                      <span v-if="plan.items && plan.items.length">({{ plan.items.length }})</span>
                                    </span>
                                    <app-show-action-chips v-if="!showDetails.activities" :plan="plan"></app-show-action-chips>
                                  </div>

                                  <app-edit-plan-action-list 
                                      :planId="plan.id"
                                      :userOwnsThisPlan="userOwnsThisPlan"
                                    ></app-edit-plan-action-list>

                                </v-expansion-panel-content>

                              </v-expansion-panel>

                            </div>
                          </v-card-text>
                        </v-flex>

                      </v-layout>
                    </v-container>
                  </v-card>
                </v-flex>

              </v-layout>
            </v-container>

          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<style>
  .plan-actions-title > .chip__content {
    height: inherit !important;
  }
</style>


<script>
import genericMixins from '../../mixins'
import planMixins from './mixins'

export default {
  name: 'SinglePlan',

  mixins: [genericMixins, planMixins],

  data () {
    return {
      pageTitle: 'Current Plan',
      showDetails: {
        staff: false,
        planDetails: false,
        resources: false,
        notes: false,
        info: false,
        activities: true
      },
      openDateEditingDlg: false,
      editing: ''
    }
  },

  computed: {
    userOwnsThisPlan () {
      return this.userOwnsPlan(this.plan)
    },
    pageStatus () {
      return this.$store.getters.pageStatus
    }
  },

  methods: {
    loadCurrentPlan () {
      let plan
      // get plan depending on current route!
      if (this.$route && this.$route.name === 'nextsunday') {
        this.pageTitle = 'This Sunday\'s Plan'
        plan = this.$store.getters.nextSunday
        if (this.plan && this.plan.id === plan.id) return
      } else {
        let planId = parseInt(this.$route.params.planId)
        if (isNaN(planId) || (this.plan && this.plan.id === planId)) return
        plan = this.plans.find((pl) => planId === pl.id)
        // console.log(planId, 'found plan?', plan)
        // perhaps the plan was coming from the HTML header on page reload
        if ((!plan || plan === 'loading') && this.$store.state.plan && this.$store.state.plan.plan ) {
          plan = this.$store.state.plan.plan
          // console.log('took plan from page header', plan)
        }
      }

      // open the staff list panel if no staff is assigned yet
      if (plan && !plan.staffList && !this.pageStatus.hasOwnProperty(plan.id)) {
        this.showDetails.staff = true
        this.showDetails.activities = false
      } else if (plan && !this.pageStatus.hasOwnProperty(plan.id)) {
        this.showDetails.staff = false
        this.showDetails.activities = true
      }

      // save current plan to the state
      this.$store.dispatch('setSinglePlan', plan)
    },
    openPlanSubtitleEdit () {
      if (!this.userOwnsThisPlan) return
      this.showDetails.planDetails = true
      this.showDetails.info = true
    },
    openDateEditing () {
      if (!this.userOwnsThisPlan) return
      this.openDateEditingDlg = !this.openDateEditingDlg
    },
    openEditDialog (what) {
      if (!this.userOwnsThisPlan) return
      this.$store.dispatch('setDialog', {type: what})
      this.$store.dispatch('showDialog')
    },
    checkEditing (what) {
      if (!this.userOwnsThisPlan) return
      this.editing = what
    },
    onFieldEdited (that) {
      if (!this.userOwnsThisPlan) return
      this.editing = ''
      this.showDetails[that] = false
      // check if there were any changes
      if (this.$refs['input-info']._data.initialValue === this.$refs['input-info']._data.lazyValue) return
      // update plan set info = this.plan[that]
      this.$store.dispatch('updatePlan', {
        id: this.plan.id,
        field: that,
        value: this.plan[that]
      })
    },
    savePageStatus () {
      if (!this.plan || this.plan === undefined) return
      if (this.pageStatus.hasOwnProperty(this.plan.id)) {
        this.pageStatus[this.plan.id].showDetails = this.showDetails
      } else {
        this.pageStatus[this.plan.id] = {}
        this.pageStatus[this.plan.id].showDetails = this.showDetails
      }
    }
  },

  watch: {
    plan (val) {
      // console.log('watching plan', val)
      // check which expansion panel is open
      if (val instanceof Object) {
        if (this.pageStatus.hasOwnProperty(this.plan.id)) this.showDetails = this.pageStatus[this.plan.id].showDetails
        if (this.plan && this.plan.teams && !this.plan.teams.length && !this.pageStatus.hasOwnProperty(this.plan.id)) {
          this.showDetails.staff = true
          this.showDetails.activities = false
        }
        return
      }

      // return to home page if this plan became void meanwhile
      this.$router.push({name: 'home'})
    },
    plans (val) {
      if (val !== 'loading' && val instanceof Object) {
        // console.log('reloading as PLANS have changed!')
        this.loadCurrentPlan()
      }
    }
  },
  mounted () {
    // console.log((new Date()).getMilliseconds(), 'mounted')
    // this.loadCurrentPlan()

    // check which expansion panel should be open
    if (!this.plan || this.plan === undefined) return
    if (this.pageStatus.hasOwnProperty(this.plan.id)) this.showDetails = this.pageStatus[this.plan.id].showDetails
  },

  updated () {
    // console.log((new Date()).getMilliseconds(), 'updated', this.plans.length)
    if (this.plans instanceof Array && this.plans.length) {
      this.loadCurrentPlan()
      this.savePageStatus()
    }
  },
  beforeDestroy () {
    this.savePageStatus()
  }
}
</script>
