<template>
  <v-container fluid>

    <v-layout row>
      <v-flex xs12 md6 offset-md3>
        <h2 class="secondary--text">Create New Plan</h2>
      </v-flex>
    </v-layout>


    <v-layout row>
      <v-flex xs12>
        <form @submit.prevent="onCreatePlan">

          <!-- TYPE and DATE picker-->
          <v-layout row>
            <v-flex xs12 md6 offset-md3>
              <v-layout row wrap>
                <v-flex xs11 sm5>
                  <v-select
                    v-bind:items="typesArray"
                    v-model="type"
                    return-object
                    item-text="name"
                    item-value="id"
                    label="Select type"
                    single-line bottom required
                  ></v-select>
                </v-flex>

                <v-spacer></v-spacer>

                <v-flex xs11 sm5>
                  <v-dialog
                      persistent
                      v-model="modalDate"
                      ref="dateDialog"
                      full-width
                      width="330px"
                      lazy>
                    <v-text-field
                        slot="activator"
                        label="Select the date"
                        v-model="date"
                        prepend-icon="event"                      
                        readonly required
                      ></v-text-field>
                    <v-date-picker 
                        v-model="date" 
                        no-title
                        first-day-of-week="0"
                        :min="onlyFutureDays.min"
                        :max="onlyFutureDays.max"
                        event-color="yellow darken-1"
                        :events="arrayEvents"
                        scrollable
                        actions>
                      <template slot-scope="{ save, cancel }">
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn flat color="primary" @click="modalDate = false">Cancel</v-btn>
                          <v-btn flat color="primary" @click="$refs.dateDialog.save(date)">OK</v-btn>
                        </v-card-actions>
                      </template>
                    </v-date-picker>
                  </v-dialog>
                </v-flex>
            </v-layout>
            </v-flex>
          </v-layout>


          <!-- Start and End TIME Picker -->
          <v-layout row>
            <v-flex xs12 md6 offset-md3>
              <v-layout row wrap>
                <v-flex xs11 sm5>
                  <v-dialog
                      persistent
                      v-model="modalTime"
                      ref="startTimeDialog"
                      full-width
                      width="330px"
                      lazy>
                    <v-text-field
                        slot="activator"
                        label="Select start time"
                        v-model="time"                      
                        prepend-icon="schedule"
                        readonly
                        required
                      ></v-text-field>
                    <v-time-picker 
                        v-model="time"
                        format="24hr"
                        scrollable
                        actions>
                      <template slot-scope="{ save, cancel }">
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn flat color="primary" @click="modalTime = false">Cancel</v-btn>
                          <v-btn flat color="primary" @click="$refs.startTimeDialog.save(time)">OK</v-btn>
                        </v-card-actions>
                      </template>
                    </v-time-picker>
                  </v-dialog>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex xs11 sm5>
                  <v-dialog
                      persistent
                      v-model="modalEndTime"
                      ref="endTimeDialog"
                      full-width
                      width="330px"
                      lazy>
                    <v-text-field
                        slot="activator"
                        label="Select end time"
                        v-model="endTime"                      
                        prepend-icon="schedule"
                        readonly
                      ></v-text-field>
                    <v-time-picker
                        v-model="endTime"
                        :min="minTimeValue" 
                        format="24hr" 
                        scrollable actions>
                      <template slot-scope="{ save, cancel }">
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn flat color="primary" @click="modalEndTime = false">Cancel</v-btn>
                          <v-btn flat color="primary" @click="$refs.endTimeDialog.save(endTime)">OK</v-btn>
                        </v-card-actions>
                      </template>
                    </v-time-picker>
                  </v-dialog>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>


          <!-- Type-specific Details (Display-Only) -->
          <v-layout row v-if="type.repeat && type.weekday >= 0">
            <v-flex xs12 md6 offset-md3>
              <h3 class="secondary--text">Type-specific Details:</h3>
              <v-layout row wrap>
                <v-flex xs11 sm5>
                  <span>Usual weekday:</span>
                  <strong>{{ type.weekday |weekdayName }}</strong>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex xs11 sm5>
                  <span>Repeated:</span>
                  <strong>{{ type.repeat }}</strong>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>


          <!-- Description -->
          <v-layout row>
            <v-flex xs12 md6 offset-md3>
              <v-text-field 
                label="Further event details"
                hint="e.g. a location - this is used for announcements"
                v-model="info"
                multi-line rows="2"
                ></v-text-field>
            </v-flex>
          </v-layout>


          <!-- Default BG image for this plan -->
          <v-layout row>
            <v-flex xs12 md6 offset-md3>
              <v-tooltip right>
                <v-btn small raised slot="activator" class="secondary" @click="onPickFile"><v-icon>image</v-icon>&nbsp; Add Image ?</v-btn>
                <span>(Optional: select an image to be the default background for this plan)</span>
              </v-tooltip>
              <input 
                type="file" 
                style="display: none" 
                ref="fileInput" 
                accept="image/*"
                @change="onFilePicked">
            </v-flex>
          </v-layout>
          <v-layout v-if="imageB64" row>
            <!-- IMAGE preview -->
            <v-flex xs12 md6 offset-md3>
              <img :src="imageB64" height="150px">
            </v-flex>
          </v-layout>


          <hr class="mt-2">
          <!-- SUBMIT -->
          <v-layout row class="my-2">
            <v-flex xs12 md6 offset-md3>
              <v-btn 
                type="submit" 
                class="primary"
                :disabled="!formIsValid" 
                :loading="loading"
                @click="loader = 'loading'"
                ><v-icon>add_box</v-icon>&nbsp;Create Plan
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
              </v-btn>
            </v-flex>
            <small>*indicates required fields</small>
          </v-layout>


          <v-layout row v-if="dayPlans && dayPlans.length">
            <v-flex xs12 md6 offset-md3>
              <h3 class="secondary--text">Existing plans on that same day:</h3>
              <app-show-simple-plan-list 
                  :planList="dayPlans"
                  hideSelect="true"
                ></app-show-simple-plan-list>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>

  </v-container>
</template>


<script>
import genericMixins from '../../mixins/'
import planMixins from './mixins'

export default {
  data () {
    return {
      type: {},
      type_id: null,
      title: '',
      staff: {},
      info: '',
      imageB64: null,
      image: null,
      date: null,
      arrayEvents: null,
      onlyFutureDays: {min: this.$moment().format('YYYY-MM-DD'), max: '2099-12-31'},
      time: '00:00',
      endTime: '00:00',
      minTimeValue: '0:00',
      modalDate: false,
      modalTime: false,
      modalEndTime: false
    }
  },

  mixins: [genericMixins, planMixins],

  computed: {
    planId () {
      return this.$store.getters.newPlanId
    },
    formIsValid () {
      if (!isNaN(this.type_id) && this.dateTime && this.$moment(this.dateTime).isValid()) return true
      return false
    },
    dateTime () {
      if (!this.date || !this.time) return null
      return this.$moment(this.date + 'T' + this.time)
    },
    endDateTime () {
      if (!this.date) return null
      // end time is not required - just use the start time
      if (!this.endTime) return this.dateTime
      return this.$moment(this.date + 'T' + this.endTime)
    },
    distanceDays () {
      if (!this.type) return {amount: 1, type: 'd'}
      if (this.type.repeat === 'weekly') return {amount: 7, type: 'd'}
      if (this.type.repeat === 'biweekly') return {amount: 14, type: 'd'}
      if (this.type.repeat === 'monthly') return {amount: 1, type: 'm'}
      if (this.type.repeat === 'yearly') return {amount: 1, type: 'y'}
    },
    dayPlans () {
      if (!this.date) return
      return this.$store.getters.plansByDate(this.date)
    }
  },

  methods: {
    onFilePicked (event) {
      const files = event.target.files
      let filename = files[0].name
      if (filename.lastIndexOf('.') <= 0) {
        this.error = 'Please add a valid file!'
      }
      // turn the file into a base64 encoded strimg
      const fileReader = new FileReader()
      // check when the file reading is finished, then continue
      fileReader.addEventListener('load', () => {
        // saves the file as base64 (the img tag can handle that in the src attribute!)
        this.imageB64 = fileReader.result
      })
      // trigger the actual file reading
      fileReader.readAsDataURL(files[0])
      // also store the actual file
      this.image = files[0]
    },

    onPickFile () {
      this.$refs.fileInput.click()
    },

    onCreatePlan () {
      if (!this.formIsValid) return

      this.$store.dispatch('setLoading', true)
      const planData = {
        date: this.dateTime.format(),
        date_end: this.endDateTime.format(),
        type_id: this.type_id,
        info: this.info,
        leader_id: 0,
        changer: this.user.name
      }
      // send 2 sep. objects as payload to the store
      this.$store.dispatch('createPlan', {
        planData,
        image: this.image
      })
      // once the plan was created successfully, open it
      .then((plan) => {
        this.$router.push({ name: 'plan', params: { planId: plan.id } })
      })
    }
  },

  watch: {
    // once the user selects a type, we can use some default values from the type object:
    type () {
      if (!Object.keys(this.plans).length) return
      this.type_id = this.type.id
      if (this.type.start !== '00:00:00') this.time = this.type.start
      if (this.type.end !== '00:00:00') this.endTime = this.type.end.substr(0, 5)
      this.info = this.type.subtitle

      // possible date of event can be calculated by checking for
      // the next >>type.weekday<<, with consideration of >>type.repeat<<
      // and the presence of plans on those possible dates
      if (!isNaN(this.type.weekday) && this.type.weekday * 1 > -1) {
        let weekday = this.type.weekday * 1
        let newDate = this.$moment()
        let diff = weekday - newDate.weekday()
        if (diff < 0) diff += 7
        newDate.add(diff, 'day')

        // check if there is already a plan of the same type on that day
        let ctrl = 9 // test max 9 iterations
        var check
        // depending on the repeat value of the type, we will be adding 
        // a certain amount of days to the proposed date if there is
        // already a plan of the same type on that day
        do {
          ctrl -= 1
          check = this.plans.find(plan => {
            return this.$moment(plan.date).isSame(newDate, 'day') && plan.type_id === this.type_id
          })
          // add more days to check for a the next free day
          if (check && check.date) newDate.add(this.distanceDays.amount, this.distanceDays.type)
        } 
        while (check && ctrl > 0 && this.distanceDays.amount > 0)

        // fill the form with the next free day
        this.date = newDate.format('YYYY-MM-DD')
      }
    },

    plans (val) {
      // on the date picker show a dot on each day that contains a plan
      this.arrayEvents = val.map((pl) => {
        return pl.date.substr(0, 10)
      })
    },

    time () {
      // set the minimal hour for the end time to be the same as the start time hour
      this.minTimeValue = (this.time).substr(0, 5)
      // if the start time is changed and the end time not set yet,
      // set the end time to the start time
      if (this.endTime && this.endTime > this.time) return
      this.endTime = this.time
    }
  },

  mounted () {
    this.$store.commit('setRouteChanging', false)
  }
}
</script>
