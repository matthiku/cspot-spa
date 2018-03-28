<template>
  <calendar-view
      transition="scale-transition"
      :events="events"
      :showDate="showDate.toDate()"
			:time-format-options="{hour: 'numeric', minute:'2-digit'}"
			@setShowDate="setShowDate"
			@click-event="onClickEvent"
      @show-date-change="changeShowDate"
      weekdayNameFormat="long"
      showEventTimes
  ></calendar-view>
</template>


<style>
.calendar-view {
  width: 100% !important;
}
.week {
  min-height: 10vh !important;
}
.event {
  cursor: pointer;
}
</style>



<script>
  // from https://github.com/richardtallent/vue-simple-calendar
  import CalendarView from "vue-simple-calendar"
	require("vue-simple-calendar/dist/static/css/default.css")

  export default {
    name: 'PlansCalendarView',

    components: {
      CalendarView
    },

    props: ['types'],

    data () {
      return {
        showDate: this.$moment()
      }
    },

    computed: {
      events () {
        if (!this.$store.getters.filteredPlans) return []
        let evs = []
        this.$store.getters.filteredPlans.forEach((pl) => {
          let obj = {
            startDate: pl.date,
            title: (this.types[pl.type_id]) ? this.types[pl.type_id].name : pl.type_id,
            id: pl.id
          }
          evs.push(obj)
        })
        return evs
      }
    },

    methods: {
			setShowDate(d) {
				this.showDate = this.$moment(d)
			},
      onClickEvent(e) {
        this.$router.push({name: 'plan', params: {planId: e.id}})
      },
      changeShowDate (d) {
        this.showDate = this.$moment(d)
      }
    },

    created() {
    }
  }
</script>