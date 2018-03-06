<template>
  <v-container fluid>

    <div v-if="plan" v-for="item in plan.actionList"
        :key="item.seqNo"
        class="fullwindow"
        @click.left="showNext()"
        @click.right="showNext(-1)"
      >

      <!-- show only current item -->
      <div v-if="item.seqNo===showSeqNo"
        >

        <!-- SONG -->
        <span v-if="item.type==='song'">
          <h3>{{ item.title }}</h3>
          <pre>{{ item.lyrics }}</pre>
        </span>

        <!-- READING -->
        <span v-if="item.type==='read'">
          <pre>{{ scriptureRefs[item.title] }}</pre>
        </span>

      </div>
    </div>

  </v-container>
</template>


<style>
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
      showSeqNo: 1
    }
  },

  created () {    
    if (!this.plan) {
      console.log('no plan found!', this.plan)
      this.$router.push('/plans')
    }
    if (!this.plan.actionList.length) {
      this.$store.commit('setError', 'Cannot present, this plan has no actions!')
      this.$router.go(-1) // go back to previous page
    }
    // make sure we show the first non-hidden slide
    this.showNext()

    // remove the scrollbar on the right side
    let page = document.getElementsByTagName('html')[0]
    page.style.overflowY = 'hidden'
  },

  methods: {
    showNext(dir) {
      // default direction is forward, -1 for backwards
      if (dir === undefined) dir = 1
      // look for the next non-hidden and non-text activity
      while (
        this.plan.actionList[this.showSeqNo].forLeadersEyesOnly || 
        this.plan.actionList[this.showSeqNo].type === 'text'
      ) {
        this.showSeqNo = this.showSeqNo + dir
        // go no further than the last or the first showable activity
        if (
          this.showSeqNo > this.plan.actionList.length ||
          this.showSeqNo < 1
        ) break
      }
    }
  },

  destroyed () {
    // enable the scrollbar again
    let page = document.getElementsByTagName('html')[0]
    page.removeAttribute('style')
  }

}
</script>
