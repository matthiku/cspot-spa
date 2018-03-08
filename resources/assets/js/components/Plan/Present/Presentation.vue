<template>
  <v-container class="presentation-space"
      v-if="plan instanceof Object && plan.hasOwnProperty('actionList')"
      fluid
      @click.left="showNext()"
      @click.right.stop.prevent="showNext(-1)"
      @click.middle.stop.prevent="goBack()"
    >

    <div v-for="item in plan.actionList"
        :key="item.seqNo"
        class="full-width"
        tabindex="0"
        @keyup.esc="goBack()"
        @keyup.space="showNext()"
        @keyup.right="showNext()"
        @keyup.left="showNext(-1)"
      >
      <!-- {{ showSeqNo }} = {{ item.seqNo }}? - {{ item.title }} -->
      <!-- show the current item -->
      <presentation-space
          v-show="item.seqNo===showSeqNo"
          :item="item"
        ></presentation-space>

    </div>

  </v-container>
</template>


<style>
.full-width {
  width: 100%;
}
.presentation-space {
  width: 100%;
  height: 100%;
  color: wheat;
  background-color: darkslategrey;
}
</style>


<script>
import presentationSpace from './PresentationSpace.vue'
import genericMixins from '../../../mixins/'
import planMixins from '../mixins'

export default {
  name: 'PlanPresentation',

  components: {
    presentationSpace
  },

  mixins: [genericMixins, planMixins],

  data () {
    return {
      /* NOTE:
        Each item in the array of activities (plan.actionList) has a sequence number.
        The seq. number is always 1 higher than the array index number of that item.
        This value, showSeqNo, determines which activity will be shown in the presentation.
      */
      showSeqNo: 0
    }
  },

  created () {
    // make sure we have a plan
    if (!(this.plan instanceof Object)) {
      console.log('no plan found, returning to plans list')
      this.$router.push('/plans')
      return
    }
    // ... and the plan contains actions!
    if (this.plan && (!this.plan.hasOwnProperty('actionList') || !this.plan.actionList.length)) {
      this.$store.commit('setError', 'Cannot present, this plan has no actions!')
      this.$router.go(-1) // go back to previous page
      return
    }

    // start the presentation by going to the first non-hidden activity
    this.showNext()

    // use full heigt of window for the presentatino
    let winHeight = window.innerHeight
    let presentationSpace = document.getElementsByClassName('presentation-space')[0]
    if (presentationSpace) {
      presentationSpace.style.height = winHeight
    }

    // remove the scrollbar on the right side
    let page = document.getElementsByTagName('html')[0]
    page.style.overflowY = 'hidden'
  },

  methods: {
    goBack () {
      this.showSeqNo = 0
      this.$router.go(-1) // go back to previous page
    },

    showNext(dir) {
      // default direction is forward, -1 for backwards
      if (dir === undefined) dir = 1

      // look for the next non-hidden and non-text activity
      // but make sure we do not iterate endlessly
      for (let i = 0; i < this.plan.actionList.length; i++) {

        // go to the next/previous activity
        this.showSeqNo = this.showSeqNo + dir

        // wrap around if end (or beginning) of action list is reached
        if (dir > 0 && this.showSeqNo > this.plan.actionList.length) this.showSeqNo = 1
        if (dir < 0 && this.showSeqNo < 1) this.showSeqNo = this.plan.actionList.length
        // console.log(this.showSeqNo, 'testing', this.plan.actionList[this.showSeqNo-1].title)

        // see if we have found the next showable activity
        if (!(this.plan.actionList[this.showSeqNo-1].forLeadersEyesOnly ||
          this.plan.actionList[this.showSeqNo-1].type === 'text')) {
            // console.log('break!', this.plan.actionList[this.showSeqNo-1].forLeadersEyesOnly, this.plan.actionList[this.showSeqNo-1].type)
            break
          }
        // console.log(this.showSeqNo, 'skipping', this.plan.actionList[this.showSeqNo-1].title)
      }
      // console.log(this.showSeqNo, 'showing', this.plan.actionList[this.showSeqNo-1].title)
    }    
  },

  destroyed () {
    // enable the scrollbar again
    let page = document.getElementsByTagName('html')[0]
    page.removeAttribute('style')
  }

}
</script>
