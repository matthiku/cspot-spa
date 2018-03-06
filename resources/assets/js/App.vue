<template>
  <v-app>

    <app-toolbar v-if="$route.name!=='present'"></app-toolbar>

    <v-content v-if="$route.name==='present'">
      <router-view></router-view>
    </v-content>

    <v-content v-else>

      <v-flex xs12 v-if="loading">
        <v-progress-linear 
            class="ma-0 pa-0"
            height="5"
            v-bind:indeterminate="true"></v-progress-linear>
      </v-flex>

      <!-- Alert Panel -->
      <v-container class="pa-0" v-if="error">
        <v-layout row>
          <v-flex xs12>
            <app-alert v-if="error" @dismissed="onDismissed('clearError')" :text="error"></app-alert>
          </v-flex>
        </v-layout>
      </v-container>


      <!-- Router-controlled MAIN CONTENT -->
      <transition name="fade">
        <router-view></router-view>
      </transition>


      <!-- popup for messages and hints -->
      <v-snackbar
          transition="fade-transition"
          :timeout="timeout"
          bottom
          v-model="showMessage"
        >
        {{ message }}
        <v-btn dark flat @click.native="onDismissed('clearMessage')">Close</v-btn>
      </v-snackbar>

    </v-content>

    <app-footer></app-footer>

  </v-app>
</template>


<style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>


<script>
  import genericMixins from './mixins/'

  export default {
    name: 'mainApp',
    mixins: [genericMixins],

    data () {
      return {
        timeout: 7500,
        showMessage: false
      }
    },

    watch: {
      message () {
        this.showMessage = this.message
      },
      user (val) {
        // push the user to the login page if the user object is gone 
        // e.g. due to a logout
        if (this.$route.name === 'login') return
        if (!val) this.$router.push('/login')
      }
    }
  }

</script>
