<template>
  <v-card>

    <v-card-text class="grey lighten-3">
      <v-list two-line>

        <!-- show all individual staff records -->
        <div v-for="item in items" v-bind:key="item.id">

          <app-edit-plan-single-staff :item="item" :userOwnsThisPlan="userOwnsThisPlan"></app-edit-plan-single-staff>

        </div>

        <!-- button and dialog to add new staff -->
        <p class="text-xs-center ma-0"> 

          <app-edit-plan-staff-dialog
            v-if="userOwnsThisPlan"
            :plan="plan" 
          ></app-edit-plan-staff-dialog>

          <span v-else-if="!items.length">no staff assigned yet</span>
        </p>

      </v-list>
    </v-card-text>

  </v-card>
</template>

<script>
import genericMixins from '../../../mixins'
import planMixins from '../mixins'

export default {
  mixins: [genericMixins, planMixins],

  props: ['userOwnsThisPlan'],

  computed: {
    items () {
      if (!this.plan || !this.plan.teams || !this.users || !this.roles) return []
      return this.plan.teams
    }
  }
}
</script>
