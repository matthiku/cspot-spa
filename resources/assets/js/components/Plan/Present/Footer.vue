<template>
    <v-footer dark fixed>

      {{ time }}
      <config-menu></config-menu>

      <v-spacer></v-spacer>

      <span v-if="currentItemSeqNo">
        {{ currentItem.title }}
        <v-tooltip top>
          <small 
              v-if="nextItem"
              @click="goNext"
              slot="activator"
              class="grey--text cursor-pointer"
            >NEXT:&nbsp;{{ nextItem.title }}
          </small>
          <span>click to go to this item</span>
        </v-tooltip>
      </span>

      <v-spacer></v-spacer>

      besides right

      <jump-menu
          :plan="plan"
          :currentItemSeqNo="currentItemSeqNo"
          v-on:keyPressed="keyPressed"
        ></jump-menu>

      right

    </v-footer>  
</template>


<script>
import jumpMenu from './JumpMenu'
import configMenu from './ConfigMenu'

import genericMixins from '../../../mixins/'
import planMixins from '../mixins'

export default {
  mixins: [genericMixins, planMixins],

  components: { configMenu, jumpMenu },

  props: ['currentItemSeqNo', 'currentSlideNo'],

  data () {
    return {
      time: this.$moment().format('H:mm')
    }
  },

  watch: {
    currentSlideNo (val) {
      // console.log('currentSlide', val)
    },
    currentItemSeqNo (val) {
      // console.log('currentItem', val)
    }
  },

  computed: {
    currentItem () {
      // get the item for the plan action list with the current seq. number
      return this.plan.actionList.find(item => item.seqNo === this.currentItemSeqNo)
    },
    nextItem () {
      return this.plan.actionList.find(
        item => item.seqNo > this.currentItemSeqNo && item.type !== 'text' && !item.forLeadersEyesOnly
      )
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

    goNext () {
      this.keyPressed({code: 'go', where: this.currentItemSeqNo + 1})
    },

    updateTimer () {
      this.time = this.$moment().format('H:mm')
      setTimeout(() => {
        this.updateTimer()
      }, 30000);
    }
  }
}
</script>

<style>

</style>
