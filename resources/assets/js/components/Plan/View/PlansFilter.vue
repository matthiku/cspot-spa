<template>
  <v-container fluid>      
    <v-layout row wrap>      

      <v-flex xs6>
        <v-subheader>Filter by Event Type</v-subheader>
      </v-flex>
      <v-flex xs6>
        <v-select
          :items="typesArray"
          item-text="name"
          item-value="id"
          v-model="filterType"
          label="Select Event Type"
          single-line dense
          bottom
        ></v-select>
      </v-flex>

      <v-flex xs6>
        <v-subheader>Filter by Staff involved</v-subheader>
      </v-flex>
      <v-flex xs6>
        <v-select
          :items="userList"
          item-text="name"
          item-value="id"
          v-model="filterUser"
          label="Select Staff"
        ></v-select>
      </v-flex>

      <v-flex xs6>
        <v-subheader>Reset Filter</v-subheader>
      </v-flex>
      <v-flex xs6>
        <v-btn @click="resetFilter">
          <v-icon>highlight_off</v-icon>
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
      filterType: null,
      filterUser: null
    }
  },

  computed: {
    userList () {
      let list = []
      Object.keys(this.users).forEach((u) => list.push(this.users[u]))
      return list
    }
  },

  watch: {
    filterType () {this.setFilter()},
    filterUser () {this.setFilter()}
  },

  methods: {
    setFilter () {
      this.$store.commit('setSearch', {
        filter: {
          type: this.filterType,
          user: this.filterUser
        }
      })
    },
    resetFilter () {
      this.filterType = -1
      this.filterUser = -1
      this.setFilter()
    }
  }
}
</script>