<template>
  <v-container fluid>

    <v-layout row>
      <v-flex xs12 md6 offset-md3>
        <h4 class="secondary--text">Create New Plan</h4 class="text--primary">
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
                    v-bind:items="types"
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
                    lazy
                    >
                    <v-text-field
                      slot="activator"
                      label="Select the date"
                      v-model="date"
                      prepend-icon="event"                      
                      readonly required
                    ></v-text-field>
                    <v-date-picker 
                      v-model="date" no-title
                      first-day-of-week="0"
                      :allowed-dates="onlyFutureDays"
                      scrollable actions>
                      <template slot-scope="{ save, cancel }">
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                          <v-btn flat color="primary" @click="save">OK</v-btn>
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
                    lazy
                  >
                    <v-text-field
                      slot="activator"
                      label="Select start time"
                      v-model="time"                      
                      prepend-icon="schedule"
                      readonly required
                    ></v-text-field>
                    <v-time-picker 
                      v-model="time" format="24hr" scrollable actions>
                      <template slot-scope="{ save, cancel }">
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                          <v-btn flat color="primary" @click="save">OK</v-btn>
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
                    lazy
                  >
                    <v-text-field
                      slot="activator"
                      label="Select end time"
                      v-model="endTime"                      
                      prepend-icon="schedule"
                      readonly
                    ></v-text-field>
                    <v-time-picker
                      v-model="endTime"
                      :allowed-hours="minMaxHourValues" 
                      format="24hr" scrollable actions>
                      <template slot-scope="{ save, cancel }">
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                          <v-btn flat color="primary" @click="save">OK</v-btn>
                        </v-card-actions>
                      </template>
                    </v-time-picker>
                  </v-dialog>
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
          <v-layout row class="mt-2">
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
      typeId: null,
      title: '',
      staff: {},
      info: '',
      imageB64: null,
      image: null,
      date: null,
      onlyFutureDays: {min: this.$moment().format('YYYY-MM-DD'), max: '2099-12-31'},
      time: '',
      endTime: '',
      minMaxHourValues: {min: 0, max: 23},
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
      return this.typeId && this.dateTime && this.$moment(this.dateTime).isValid()
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
    plans () {
      return this.$store.getters.plans
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
        end: this.endDateTime.format(),
        typeId: this.typeId,
        staff: {},
        info: this.info
      }
      // send 2 sep. objects as payload to the store
      this.$store.dispatch('createPlan', {
        planData,
        image: this.image
      })
    }
  },

  created () {
    this.$store.dispatch('clearNewPlanId')
  },

  watch: {
    // once the user selects a type, we can use some default values from the type object:
    type () {
      this.typeId = this.type.id
      if (this.type.start !== '00:00:00') this.time = this.type.start
      if (this.type.end !== '00:00:00') this.endTime = this.type.end.substr(0, 5)
      this.info = this.type.subtitle
      // possible date of event can be calculated by checking for
      // the next >>type.weekday<<, with consideration of >>type.repeat<<
      // and the presence of plans on those possible dates
      if (this.type.weekday && this.type.weekday * 1 > -1) {
        let weekday = this.type.weekday * 1
        let newDate = this.$moment()
        let diff = weekday - newDate.weekday()
        if (diff < 0) diff += 7
        newDate.add(diff, 'day')

        // check if there is already a plan of the same type on that day
        let ctrl = 9 // test max 9 iterations
        var check
        do {
          ctrl -= 1
          check = this.plans.find(plan => {
            return this.$moment(plan.date).isSame(newDate, 'day') && plan.typeId === this.typeId
          })
          // add more days to check for a free day
          if (check && check.date) newDate.add(7, 'd')
        } while (check && (!check.date || ctrl < 0))
        // fill the form with the next free day
        this.date = newDate.format('YYYY-MM-DD')
      }
    },

    // wait until the new plan was added to the array of plans
    // then open the new plan
    planId () {
      if (!this.planId) return
      console.log('opening new plan, id', this.planId)
      this.$router.push({ name: 'plan', params: { planId: this.planId } })
    },

    time () {
      // set the minimal hour for the end time to be the same as the start time hour
      this.minMaxHourValues.min = (this.time).substr(0, 2) * 1
      // if the start time is changed and the end time not set yet,
      // set the end time to the start time
      if (this.endTime && this.endTime > this.time) return
      this.endTime = this.time
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
