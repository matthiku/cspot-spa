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
            <v-icon color="primary">{{ staff.icon }}</v-icon>
            <span>
              {{ staff.userName | firstWord }}
            </span>
          </span>
          <span>{{ staff.role | ucFirst }}</span>
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

  props: ['plan', 'showDetails'],

  computed: {
    staffList () {
      if (!this.plan.staffList || !this.plan.staffList.length) this.createStaffList(this.plan)
      return this.plan.staffList
    }
  }
}
</script>
