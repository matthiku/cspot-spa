<template>
  <v-container fluid>
    the plan presentation
  </v-container>
</template>


<style>

</style>


<script>
import genericMixins from '../../../mixins/'
import planMixins from '../mixins'

export default {
  name: 'SinglePlan',

  mixins: [genericMixins, planMixins]
}
</script>
