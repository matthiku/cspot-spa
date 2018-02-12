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
            <v-icon color="primary">{{ roles[staff.role_id].icon }}</v-icon>
            <span>
              {{ users[staff.user_id].name | firstWord }}
            </span>
          </span>
          <span>{{ roles[staff.role_id].name | ucFirst }}</span>
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
      if (!this.singlePlan || !this.singlePlan.id) return []
      return this.singlePlan.teams
    }
  }
}
</script>
