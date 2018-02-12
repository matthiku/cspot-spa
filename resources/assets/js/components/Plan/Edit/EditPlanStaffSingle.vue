<template>
  <v-list-tile avatar>
    <v-list-tile-avatar :title="roles[item.role_id].name">
      <v-icon class="grey lighten-1 white--text">{{ roles[item.role_id].icon }}</v-icon>
    </v-list-tile-avatar>

    <!-- show actual role and staff detail -->
    <v-list-tile-content v-show="!warning">
      <v-list-tile-title>{{ users[item.user_id].name }}</v-list-tile-title>
      <v-list-tile-sub-title>{{ roles[item.role_id].name | ucFirst }}</v-list-tile-sub-title>
    </v-list-tile-content>

    <v-list-tile-content v-show="warning">
      <v-list-tile-sub-title class="red--text mt-0 pt-0">
        Removing {{ roles[item.role_id].name }} 
        ({{ users[item.user_id].name | firstWord }})?
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

  methods: {
    removeStaff () {
      this.$store.dispatch('removeStaffFromPlan', {
        planId: this.plan.id,
        staffId: this.item.id
      })
      .then(() => {
        // this.createStaffList() => change to store.dispatch!
        this.warning = false
        // remove the local staff from the staffList array
        let idx = this.items.find((el) => el.id === this.item.id)
        if (idx) this.items.splice(idx, 1)
      })
    }
  }
}
</script>

<style>

</style>
