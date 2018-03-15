<template>
    <v-footer dark fixed>

      {{ time }}

      <v-spacer></v-spacer>

      middle

      <v-spacer></v-spacer>

      right

    </v-footer>  
</template>


<style>

</style>


<script>
import genericMixins from '../../../mixins/'
import planMixins from '../mixins'

export default {
  mixins: [genericMixins, planMixins],

  props: ['currentItem', 'currentSlide'],

  data () {
    return {
      time: this.$moment().format('H:mm')
    }
  },

  watch: {
    currentSlide (val) {
      console.log('currentSlide', val)
    },
    currentItem (val) {
      console.log('currentItem', val)
    }
  },

  mounted () {
    this.updateTimer()
  },

  methods: {
    updateTimer () {
      setTimeout(() => {
        this.time = this.$moment().format('H:mm')
        console.log('updateTimer', this.time)
        this.updateTimer()
      }, 30000);
    }
  }
}
</script>

<style>

</style>
