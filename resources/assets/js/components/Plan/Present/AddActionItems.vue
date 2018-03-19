<template>
  <div class="text-xs-center">
    <v-menu
        bottom
        v-model="menu"
        :close-on-content-click="false"
      >
      <v-btn icon dark slot="activator">
        <v-tooltip top>
          <v-icon slot="activator">playlist_add</v-icon>
          <span>configuration</span>
        </v-tooltip>
      </v-btn>

      <v-card dark>

        blah-di-blah di blah-di-blah

      </v-card>
    </v-menu>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        menu: false
      }
    },

    computed: {
      presentation () {
      }
    },

    mounted () {
    },

    watch: {
    }
  }
</script>