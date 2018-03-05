<template>
  <v-container fluid>      
    <v-layout row wrap>      

      <v-flex xs6>
        <v-subheader>Filter by Event Type</v-subheader>
      </v-flex>
      <v-flex xs6>
        <v-select
          :items="typesList"
          item-text="name"
          item-value="id"
          v-model="filterType"
          label="Select Event Type"
          dense
        ></v-select>
      </v-flex>

      <v-flex xs6>
        <v-subheader>Filter by Member of Staff involved</v-subheader>
      </v-flex>
      <v-flex xs6>
        <v-select
          :items="usersList"
          item-text="name"
          item-value="id"
          v-model="filterUser"
          label="Select User Name"
          dense
        ></v-select>
      </v-flex>

      <v-flex xs6 class="text-xs-right">
        <v-btn @click="resetFilter">
          Show All &nbsp;
          <v-icon>done_all</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs6>
        <v-btn @click="filterUser = user.id" class="ml-0">
          Show Your Plans &nbsp;
          <v-icon>assignment_ind</v-icon>
        </v-btn>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
import genericMixins from '../../../mixins/'
import planMixins from '../mixins'

export default {

  mixins: [genericMixins, planMixins],

  data () {
    return {
      filterUser: '*',
      filterType: '*'
    }
  },

  computed: {
    // create an array of users for the drop-down select
    usersList () {
      let list = [{id: '*', name: 'All'}]
      Object.keys(this.users)
        .forEach((u) => {
          // check if one of the roles is an 'event' role
          let forEvent = false
          let roles = this.users[u].roles // array of user roles
          if (roles && roles.forEach) {
            roles.forEach((rl) => {
              if (rl.for_events) forEvent = true
            })
          }
          if (forEvent) list.push(this.users[u])
        })
      return list
    },
    typesList () {
      // add an id for showing all types (that is, no filter is set)
      return [{id: '*', name: 'All'}, ...this.typesArray]
    }
  },

  watch: {
    filterType () {this.setFilter()},
    filterUser () {this.setFilter()},
    search () {this.readFilter()}
  },

  methods: {
    // Reflect existing filter settings from the store in the form
    readFilter () {
      this.filterType = this.search ? this.search.filter ? this.search.filter.type : '*' : '*'
      this.filterUser = this.search ? this.search.filter ? this.search.filter.user : '*' : '*'
    },
    setFilter (reset) {
      let obj = {
        filter: {
          type: reset ? '*' : this.filterType,
          user: reset ? '*' : this.filterUser
        },
      }
      this.$store.commit('setSearch', obj)
      // close the filter dialog in the parent component
      this.closeFilterPanel()
    },
    resetFilter () {
      this.setFilter('reset!')
    },
    closeFilterPanel () {
      this.$emit('closeFilterPanel')
    }
  }
}
</script>