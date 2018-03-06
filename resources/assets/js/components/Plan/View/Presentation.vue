<template>
  <v-container fluid>
    <div v-if="plan" v-for="item in plan.actionList" :key="item.seqNo">
      <div v-if="item.seqNo===stage"
          class="fullwindow"
          @click="stage++">
        {{ item.title }}
      </div>
    </div>
  </v-container>
</template>


<style scoped>
html {
  overflow-y: hidden;
}
.fullwindow {
  width: 100%;
  height: 100%;
}
</style>


<script>
import genericMixins from '../../../mixins/'
import planMixins from '../mixins'

export default {
  name: 'PlanPresentation',

  mixins: [genericMixins, planMixins],

  data () {
    return {
      stage: 1
    }
  },

  created () {    
    if (!this.plan) {
      console.log('no plan found!', this.plan)
      this.$router.push('/plans')
    }

    let page = document.getElementsByTagName('html')[0]
    page.style.overflowY = 'hidden'
  }
}
</script>
