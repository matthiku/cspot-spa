<template>
  <span
    >
    <v-footer v-if="showFooter"
        dark fixed
      >

      <v-btn small absolute dark fab
          top left color="brown"
          @click="showFooter = false"
        ><v-icon>expand_more</v-icon>
      </v-btn>

      <v-chip outline color="primary" class="ml-5">{{ time }}</v-chip>

      <config-menu></config-menu>


      <v-spacer></v-spacer>


      <!-- show title of PREVIOUS item -->
      <small 
          v-if="prevItem"
          @click="goPrevItem"
          class="grey--text cursor-pointer mr-2"
        >{{ prevItem ? prevItem.title.substr(0,25) : 'n/f' }}
      </small>
      
      <v-icon
          v-if="prevItem"
          @click="goPrevItem"
          class="cursor-pointer"
          :title="prevItem.title"
        >fast_rewind</v-icon>

      <v-icon
          v-if="currentItem"
          @click="goPrevSlide"
          title="show previous slide"
          class="cursor-pointer"
        >keyboard_arrow_left</v-icon>


      <!-- show current item title -->
      <span v-if="currentItemSeqNo && currentItem"
          :title="currentItem.title"
        >
        {{ currentItem.title.substr(0,25) }}
        <v-icon
            @click="goNextSlide"
            title="show next slide"
            class="cursor-pointer"
          >keyboard_arrow_right</v-icon>
      </span>

      <v-icon
          v-if="nextItem"
          @click="goNextItem"
          class="cursor-pointer"
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
      <add-action-items
          v-if="userOwnsThisPlan"
          :firstVisibleItem="firstVisibleItem"
        ></add-action-items>

      
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


<script>
import jumpMenu from './JumpMenu'
import configMenu from './ConfigMenu'
import addActionItems from './AddActionItems'

import genericMixins from '../../../../mixins/'
import planMixins from '../../mixins'

export default {
  mixins: [genericMixins, planMixins],

  components: { configMenu, jumpMenu, addActionItems },

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
        item => item.seqNo > this.currentItemSeqNo && item.type !== 'text' && !item.forLeadersEyesOnly
      )
    },

    prevItem () {
      // reverse the array of actions in order to find the previous showable item
      let item = this.actionList.reverse().find(
        item => item.seqNo < this.currentItemSeqNo -1 && item.type !== 'text' && !item.forLeadersEyesOnly
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
