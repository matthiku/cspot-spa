<template>
  <span
    >
    <v-footer v-if="showFooter"
        dark fixed
      >

      <!-- button to minimize footer -->
      <v-btn small absolute dark fab
          top left color="brown"
          @click="showFooter = false"
        ><v-icon>expand_more</v-icon>
      </v-btn>

      <!-- show CLOCK -->
      &nbsp; &nbsp;<span class="show-clock ml-5">{{ time }}</span>


      <!-- button for configuration menu -->
      <config-menu></config-menu>


      <v-spacer></v-spacer>


      <!-- show Navigation icons and Title of  PREVIOUS  item -->
      <small 
          v-if="prevItem"
          @click="goPrevItem"
          class="grey--text cursor-pointer mr-2"
        >{{ prevItem ? prevItem.title.substr(0,25) : 'n/f' }}
      </small>
      
      <v-icon
          v-if="prevItem"
          @click="goPrevItem"
          class="mr-2 cursor-pointer"
          :title="prevItem.title"
        >fast_rewind</v-icon>

      <v-icon
          v-if="currentItem && currentSlideNo > 0"
          @click="goPrevSlide"
          title="show previous slide"
          class="ml-1 cursor-pointer"
        >keyboard_arrow_left</v-icon>


      <!-- show  TITLE  of current Plan Activity item -->
      <span v-if="currentItemSeqNo && currentItem"
          :title="currentItem.title"
        >
        {{ currentItem.seqNo }}.0&nbsp;
        {{ currentItem.title.substr(0,35) }}&nbsp;
        <span v-if="presentation.numberOfSlides > 1">
          ({{ currentSlideNo + 1 }} of {{ presentation.numberOfSlides }})</span>
        <v-icon
            v-if="currentSlideNo + 1 < presentation.numberOfSlides"
            @click="goNextSlide"
            title="show next slide"
            class="mr-1 cursor-pointer"
          >keyboard_arrow_right</v-icon>
      </span>

      <v-icon
          v-if="nextItem"
          @click="goNextItem"
          class="ml-2 cursor-pointer"
          :title="nextItem.title"
        >fast_forward</v-icon>

      <!-- show title of NEXT item -->
      <small 
          v-if="nextItem"
          @click="goNextItem"
          class="grey--text cursor-pointer ml-2"
        >{{ nextItem ? nextItem.title.substr(0,25) : 'n/f' }}
      </small>


      <v-spacer></v-spacer>

      <!-- ADD plan activity items -->
      <add-action-item
          v-if="userOwnsThisPlan"
          :firstVisibleItem="firstVisibleItem"
        ></add-action-item>

      
      <!-- show menu to JUMP to other plan activity items -->
      <jump-menu
          :plan="plan"
          :currentItemSeqNo="currentItemSeqNo"
          v-on:keyPressed="keyPressed"
        ></jump-menu>

    </v-footer>


    <v-footer v-else
        style="min-height: 0"
        dark fixed height="5">

      <v-btn small absolute dark fab
          top left color="brown"
          @click="showFooter = true"
        ><v-icon>expand_less</v-icon>
      </v-btn>      
    </v-footer>

  </span>
</template>

<style>
.show-clock {
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 3px;
  font-size: large;
}
</style>


<script>
import jumpMenu from './JumpMenu'
import configMenu from './ConfigMenu'
import addActionItem from './AddActionItem'

import genericMixins from '../../../../mixins/'
import planMixins from '../../mixins'

export default {
  mixins: [genericMixins, planMixins],

  components: { configMenu, jumpMenu, addActionItem },

  props: ['currentItemSeqNo', 'currentSlideNo', 'firstVisibleItem'],

  data () {
    return {
      showFooter: true,
      time: this.$moment().format('H:mm')
    }
  },

  watch: {
    // watch dialog to see if we need to save a newly selected song or reading
    dialog (val) {
      // console.log('dialog', val)
      // watch if user added a new scripture ref via the dialog
      if ((val.field === 'scriptureRef' || val.field === 'songSelected') && val.value) {
        let obj = {
          planId: this.plan.id,
          type: val.field === 'scriptureRef' ? 'read' : 'song',
          seqNo: (this.currentItemSeqNo || this.actionList.length) + 1,
          value: val.value
        }
        this.$store.dispatch('addActionItemToPlan', obj)
        .then((data) => {
          console.log(data.data, obj)
          this.keyPressed({code: 'go', where: data.data.seq_no})
        })
      }
    }
  },

  computed: {
    userOwnsThisPlan () {
      if (this.userIsAdmin) return true
      return this.userOwnsPlan(this.plan)
    },

    currentItem () {
      // get the item for the plan action list with the current seq. number
      return this.actionList.find(item => item.seqNo === this.currentItemSeqNo)
    },

    nextItem () {
      return this.actionList.find(
        item => item.seqNo > this.currentItemSeqNo && !item.forLeadersEyesOnly
      )
    },

    prevItem () {
      // reverse the array of actions in order to find the previous showable item
      let item = this.actionList.reverse().find(
        item => item.seqNo < this.currentItemSeqNo && !item.forLeadersEyesOnly
      )
      // re-reverse the list again
      this.actionList.reverse()
      return item
    }
  },

  mounted () {
    this.updateTimer()
  },

  methods: {
    // relay the action to the parent, footer component
    keyPressed (where) {
      this.$emit('keyPressed', where)
    },
    goNextItem () {
      this.keyPressed({code: 'go', where: this.currentItemSeqNo + 1})
    },
    goPrevItem () {
      this.keyPressed({code: 'go', where: this.currentItemSeqNo - 1})
    },
    goNextSlide () {
      this.keyPressed({code: 'go', where: 'nextSlide'})
    },
    goPrevSlide () {
      this.keyPressed({code: 'go', where: 'prevSlide'})
    },

    updateTimer () {
      this.time = this.$moment().format('H:mm')
      setTimeout(() => {
        this.updateTimer()
      }, 30000);
    },
    toggleFooter () {
      if (this.footerHeight === 32) this.footerHeight = 3
      else this.footerHeight = 32
    }
  }
}
</script>
