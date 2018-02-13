<template>
  <v-data-table
      v-model="selected"
      :headers="headers"
      :items="planList"
      item-key="date"
      hide-actions
      class="elevation-1"
    >
    <template slot="headers" slot-scope="props">
      <tr>
        <th v-if="!hideSelect" class="pa-0 ma-0"></th>

        <th class="subheading pa-0 ma-0" v-for="header in props.headers" :key="header.text">
          {{ header.text }}
        </th>
      </tr>
    </template>

    <template slot="items" slot-scope="props">
      <tr :active="props.selected" @click="onPlanSelected(props)">
        <td v-if="!hideSelect">
          <v-checkbox
            primary
            hide-details
            :input-value="props.selected"
          ></v-checkbox>
        </td>

        <td class="text-xs-center">
          {{ props.item.date | dateShort }},
          <span class="no-wrap">
            {{ Object.keys(types).length && types[props.item.type_id] ? types[props.item.type_id].name : props.item.type_id }}
          </span>
        </td>

        <td class="text-xs-right">
          {{ props.item.items ? props.item.items.length : 0 }}
        </td>

        <td class="text-xs-right">
          {{ Object.keys(users).length && users[props.item.leader_id] ? users[props.item.leader_id].name : props.item.leader_id }}
        </td>

        <td class="text-xs-right">
          {{ Object.keys(users).length && users[props.item.teacher_id] ? users[props.item.teacher_id].name : props.item.teacher_id }}
        </td>
      </tr>
    </template>

    <template slot="no-data">
      <v-alert :value="true" color="error" icon="warning">
        Sorry, no plans found for you :(
      </v-alert>
    </template>

  </v-data-table>
</template>

<script>
  import genericMixins from '../../../mixins/'
  import planMixins from '../mixins'

  export default {
    props: ['planList', 'hideSelect'],

    mixins: [genericMixins, planMixins],

    data () {
      return {
        selected: [],
        headers: [
          { text: 'Date', value: 'date' },
          { text: 'Items', value: 'items' },
          { text: 'Leader', value: 'leader' },
          { text: 'Teacher', value: 'teacher' }
        ]
      }
    },

    created () {
      this.$store.dispatch('setDialog', {selectedPlan: undefined})
      // if only one plan was provided for this list, we can already select it
      if (this.planList && Object.keys(this.planList).length === 1) {
        this.selected = this.planList
        this.$store.dispatch('setDialog', {selectedPlan: this.planList[0].id})
      }
    },

    methods: {
      onPlanSelected (props) {
        props.selected = !props.selected

        // publish the selected plan and make sure only one is selected!
        if (props.selected) {
          this.$store.dispatch('setDialog', {selectedPlan: undefined})
        } else {
          this.$store.dispatch('setDialog', {selectedPlan: props.item.id})
          if (this.selected.length > 1) this.selected = []
        }
      }
    }
  }
</script>
