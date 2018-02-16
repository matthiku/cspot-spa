<template>
  <v-list-tile avatar>

    <v-list-tile-avatar :title="roles_name">
      <v-icon class="grey lighten-1 white--text">{{ roles_icon }}</v-icon>
    </v-list-tile-avatar>


    <!-- show actual role and staff detail -->
    <v-list-tile-content v-show="!warning">
      <v-list-tile-title>{{ user_name }}</v-list-tile-title>
      <v-list-tile-sub-title>
        {{ roles_name | ucFirst }}
      </v-list-tile-sub-title>
    </v-list-tile-content>
    

    <v-list-tile-content v-show="warning">
      <v-list-tile-sub-title class="red--text mt-0 pt-0">
        Removing {{ roles_name }} 
        ({{ user_name | firstWord }})?
        <v-btn flat small @click="removeStaff(item)" color="red">Yes<v-icon>info</v-icon></v-btn>
        <v-btn flat small @click="warning = false">Cancel<v-icon>highlight_off</v-icon></v-btn>
      </v-list-tile-sub-title>
    </v-list-tile-content>


    <v-list-tile-action v-show="!item.warning" v-if="userOwnsThisPlan">
      <v-btn icon ripple title="remove this role" @click="warning = true">
        <v-icon color="red lighten-1">delete</v-icon>
      </v-btn>
    </v-list-tile-action>

  </v-list-tile>
</template>


<script>
import genericMixins from '../../../mixins'
import planMixins from '../mixins'

export default {
  mixins: [genericMixins, planMixins],

  props: ['item', 'userOwnsThisPlan'],

  data () {
    return {
      warning: false
    }
  },
  computed: {
    roles_icon () {
      return Object.keys(this.roles).length && this.roles[this.item.role_id] ? this.roles[this.item.role_id].icon : ''
    },
    roles_name () {
      return Object.keys(this.roles).length && this.roles[this.item.role_id] ? this.roles[this.item.role_id].name : this.item.role_id
    },
    user_name () {
      return Object.keys(this.users).length && this.users[this.item.user_id] ? this.users[this.item.user_id].name : this.item.user_id
    }
  },

  methods: {
    removeStaff () {
      this.$store.dispatch('removeStaffFromPlan', {
        planId: this.plan.id,
        staffId: this.item.id,
        name: this.user_name,
        role: this.roles_name
      })
      .then(() => {
        this.warning = false
      })
    }
  }
}
</script>

<style>

</style>
