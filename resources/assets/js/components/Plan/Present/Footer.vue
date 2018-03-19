<template>
  <span>
    <v-footer dark fixed>

      <v-chip outline color="primary">{{ time }}</v-chip>

      <config-menu></config-menu>

      <v-spacer></v-spacer>
      
      <v-icon
          @click="goPrevItem"
          class="cursor-pointer"
        >fast_rewind</v-icon>

      <v-icon
          @click="goPrevSlide"
          class="cursor-pointer"
        >keyboard_arrow_left</v-icon>


      <!-- show current item title -->
      <span v-if="currentItemSeqNo">
        {{ currentItem.title }}
        <v-icon
            @click="goNextSlide"
            class="cursor-pointer"
          >keyboard_arrow_right</v-icon>
      </span>

      <v-icon
          @click="goNextItem"
          class="cursor-pointer"
        >fast_forward</v-icon>


      <v-spacer></v-spacer>

      <!-- show title of next item -->
      <small 
          v-if="nextItem"
          @click="goNextItem"
          slot="activator"
          class="grey--text cursor-pointer"
        >NEXT:&nbsp;{{ nextItem.title }}
      </small>


      <!-- add plan activity items -->
      <add-action-items></add-action-items>

      
      <!-- show menu to jump to other plan activity items -->
      <jump-menu
          :plan="plan"
          :currentItemSeqNo="currentItemSeqNo"
          v-on:keyPressed="keyPressed"
        ></jump-menu>

    </v-footer>  

    <app-edit-plan-action-scripture-dialog></app-edit-plan-action-scripture-dialog>

  </span>
</template>


<script>
import jumpMenu from './JumpMenu'
import configMenu from './ConfigMenu'
import addActionItems from './AddActionItems'

import genericMixins from '../../../mixins/'
import planMixins from '../mixins'

export default {
  mixins: [genericMixins, planMixins],

  components: { configMenu, jumpMenu, addActionItems },

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
    },
    dialog (val) {
      // watch if user added a new scripture ref via the dialog
      if (val.field === 'scriptureRef' && val.value) {
        this.$store.dispatch('addActionItemToPlan', {
          planId: this.plan.id,
          type: 'read',
          seqNo: this.currentItemSeqNo,
          value: val.value
        })
        .then(result => {
          console.log('scripture item added', this.actionList)
          this.goNextItem()
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

    addScripture () {
      // show dialog to select scripture
      this.$store.commit('setDialog', {field: 'scriptureDlg', dark: true})
      let dlg = this.$refs.addScriptureDialog || this.$refs.dialog
      console.log(this.$refs)
      if (dlg) {
        console.log(dlg)
        dlg.style.position = 'absolute'
        dlg.style.top = window.innerHeight - dlg.offsetHeight
      }
      this.$store.commit('showDialog')
    },
    addSong () {
      // show dialog to select a song
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
