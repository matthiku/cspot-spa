<template>
  <vue-calendar
      :show-limit="3"
      :events="events"
      :disable="disabledDays"
      :highlight="highlightDays"

      @show-all="showAll"
      @day-clicked="dayClicked"
      @event-clicked="eventClicked"
      @month-changed="monthChanged"
  ></vue-calendar>
</template>

<script>
  export default {
    name: 'PlansCalendarView',

    computed: {
      events () {
        if (!this.$store.getters.filteredPlans) return []
        let evs = []
        this.$store.getters.filteredPlans.forEach((pl) => {
          let obj = {
            start: pl.date,
            end: pl.date_end,
            title: pl.type_id,
            class: 'test-class'
          }
          evs.push(obj)
        })
        return evs
      }
    },

    data () {
      return {
        disabledDays: {},
        highlightDays: {}
      }
    },

    methods: {
      showAll(events) {
        // Do something...
      },
      dayClicked(day) {
        // Do something...
        console.log('dayClicked')
      },
      eventClicked(event) {
        // Do something...
      },
      monthChanged(start, end) {
        // Do something...
        console.log('monthChanged')
      }
    },

    created() {
      this.$calendar.eventBus.$on('show-all', events => showAll(events))
      this.$calendar.eventBus.$on('day-clicked', day =>  dayClicked(day))
      this.$calendar.eventBus.$on('event-clicked', event => eventClicked(event))
      this.$calendar.eventBus.$on('month-changed', (start, end) => monthChanged(start, end))
    }
  }
</script>