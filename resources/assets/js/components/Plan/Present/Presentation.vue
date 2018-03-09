<template>
  <v-container fluid
      v-if="plan instanceof Object && plan.hasOwnProperty('actionList')"
      class="presentation-space"
      @click.left="showNext()"
      @click.right.stop.prevent="showNext(-1)"
      @click.middle.stop.prevent="exitPresentation()"
    >

    <div v-for="item in plan.actionList"
        v-if="item.type==='song' || item.type==='read'"
        :key="item.seqNo"
        class="full-width"
        tabindex="0"
        @keyup.esc="exitPresentation()"
        @keyup.space="showNext()"
        @keyup.right="showNext()"
        @keyup.left="showNext(-1)"
      >

      <!-- show the current item -->
      <presentation-space 
          :item="item"
        ></presentation-space>

    </div>

  </v-container>
</template>


<style>
.hidden {
  display: none;
}
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
      showSlideNo: 1
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

  mounted () {
    // start the presentation by going to the first activity
    this.showNext(-1)
  },

  methods: {
    exitPresentation () {
      this.showSlideNo = 0
      this.$router.go(-1) // go back to previous page
    },

    showNext(dir) {
      // default direction is forward, -1 for backwards
      if (dir === undefined) dir = 1

      // get all elements with the class 'presentation-slide'
      let slides = document.getElementsByClassName('presentation-slide')
      if (!slides.length) {
        console.log('no showable slides found!')
        // this.$store.commit('setError', 'Cannot present, this plan has no showable actions!')
        // this.$router.go(-1) // go back to previous page
        return
      }

      // increase the visible-slide-indicator
      // but make sure we do net get 'out-of-bounds'
      this.showSlideNo = this.showSlideNo + dir
      if (this.showSlideNo < 0) this.showSlideNo = slides.length -1
      if (this.showSlideNo >= slides.length) this.showSlideNo = 0

      // look for the next slide to be shown and hide all others
      for (let index = 0; index < slides.length; index++) {
        const element = slides[index]
        if (index === this.showSlideNo) {
          element.classList.toggle('hidden')
        } else {
          element.classList.add('hidden')
        }
      }
    }    
  },

  destroyed () {
    // enable the scrollbar again - TODO: only remove the 'overflow' attribute!
    let page = document.getElementsByTagName('html')[0]
    page.removeAttribute('style')
  }

}
</script>
