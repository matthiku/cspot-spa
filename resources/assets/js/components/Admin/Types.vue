<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">

      <v-layout column align-center>

        <!-- <app-admin-edit-field-dialog></app-admin-edit-field-dialog> -->

        <v-data-table
            v-bind:headers="headers"
            :items="types"
            :search="search.filter"
            hide-actions
            class="elevation-1"
          >
          <template slot="items" slot-scope="props">

            <td class="text-xs-right">
              {{ props.item.id }}</td>

            <td class="text-xs-right cursor-pointer" title="click to edit"
              @click="editField('name', props.item)">
              {{ props.item.name }}</td>

            <td class="text-xs-right cursor-pointer" title="click to edit"
              @click="editField('subtitle', props.item)">
              {{ props.item.subtitle }}</td>

            <td class="text-xs-right cursor-pointer" title="click to edit"
              @click="editField('weekday', props.item, 'weekdays')">
              {{ props.item.weekday | weekdayName }}</td>

            <td class="text-xs-right cursor-pointer" title="click to edit"
              @click="editField('repeat', props.item, 'repeats')">
              {{ props.item.repeat }}</td>

            <td class="text-xs-right cursor-pointer" title="click to edit"
              @click="editField('start', props.item, 'time')">
              {{ props.item.start | time }}</td>

            <td class="text-xs-right cursor-pointer" title="click to edit"
              @click="editField('end', props.item, 'time')">
              {{ props.item.end | time }}</td>

            <td class="text-xs-right">
              <v-btn @click="removeType(props.item)"
                class="ma-0"
                v-if="!props.item.users" color="error" fab small dark>
                <v-icon>delete</v-icon>
              </v-btn>
            </td>

          </template>
          <template slot="no-data">
            <v-alert :value="true" color="error" icon="warning">
              Sorry, nothing to display here :(
            </v-alert>
          </template>
        </v-data-table>
        <v-btn color="primary" @click="addType">add type</v-btn>
      </v-layout>

    </v-slide-y-transition>
  </v-container>
</template>

<script>
  import genericMixins from '../../mixins/'
  import planMixins from '../Plan/mixins'

  export default {
    name: 'EventTypesList',

    mixins: [genericMixins, planMixins],

    data () {
      return {
        headers: [
          { text: 'Id', value: 'id' },
          { text: 'Name', value: 'name' },
          { text: 'Subtitle', value: 'subtitle' },
          { text: 'Weekday', value: 'weekday' },
          { text: 'Repeat', value: 'repeat' },
          { text: 'Start', value: 'start' },
          { text: 'End', value: 'end' }
        ]
      }
    },

    created () {
      this.$store.dispatch('hideDialog')
    },

    watch: {
      dialogShow () {
        if (!this.dialog.updated ||
          this.dialog.type !== 'type') return

        this.$store.dispatch('updateType', {
          id: this.dialog.item.id,
          field: this.dialog.field,
          value: this.dialog.item[this.dialog.field]
        })
      }
    },

    methods: {
      editField (field, what, items) {
        if (!this.userIsAdmin) return

        if (items === '') {
          this.$store.dispatch('setDialog', {field, item: what, type: 'type'})
        } else {
          if (items === 'weekdays') {
            items = [
              {text: 'None', value: ''},
              {text: 'Sunday', value: 0},
              {text: 'Monday', value: 1},
              {text: 'Tuesday', value: 2},
              {text: 'Wednesday', value: 3},
              {text: 'Thursday', value: 4},
              {text: 'Fridday', value: 5},
              {text: 'Saturday', value: 6}
            ]
          }
          if (items === 'repeats') {
            items = [
              {text: 'None', value: ''},
              {text: 'weekly', value: 'weekly'},
              {text: 'biweekly', value: 'biweekly'},
              {text: 'monthly', value: 'monthly'},
              {text: 'yearly', value: 'yearly'}
            ]
          }
          this.$store.dispatch('setDialog', {field, item: what, type: 'type', select: items})
        }
        this.$store.dispatch('showDialog')
      },
      addType () {
        if (!this.userIsAdmin) return
        // create a new dummy type
        this.types.push({name: '', id: this.types.length})
        // let the user give it a proper name
        this.$store.dispatch('setDialog', {field: 'name', item: this.types[this.types.length - 1], type: 'type'})
        // the following command makes the edit dialog visible
        this.$store.dispatch('showDialog')
        // the watcher of showDialog will then dispatch the creation of the new type in the DB
      },
      removeType (type) {
        if (!this.userIsAdmin) return
        this.$store.dispatch('removeType', type)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
