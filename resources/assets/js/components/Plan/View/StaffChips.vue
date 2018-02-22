<template>
  <span>

      <v-chip outline 
          v-for="(staff, index) in staffList"
          :key="index"
          color="primary"
          class="plan-actions-title my-0 caption"
        >
        <v-tooltip bottom lazy>
          <span slot="activator">
            <v-icon color="primary">{{ roles instanceof Object ? roles[staff.role_id].icon : staff.role_id }}</v-icon>
            <span>
              {{ (users instanceof Object && users[staff.user_id] ? users[staff.user_id].name : staff.user_id) | firstWord }}
            </span>
          </span>
          <span>{{ (roles instanceof Object &&  roles[staff.role_id] ? roles[staff.role_id].name : staff.role_id) | ucFirst }}</span>
        </v-tooltip>
      </v-chip>

      <span 
          v-if="!staffList || !staffList.length"
          class="caption"           
        >(no staff assigned yet)
      </span>

  </span>
</template>

<script>
import genericMixins from '../../../mixins'
import planMixins from '../mixins'

export default {
  mixins: [genericMixins, planMixins],

  props: ['single-plan'],

  computed: {
    staffList () {
      if (!this.singlePlan || !this.singlePlan.id || !Object.keys(this.users).length || !Object.keys(this.roles).length) return []
      return this.singlePlan.teams
    }
  }
}
</script>
