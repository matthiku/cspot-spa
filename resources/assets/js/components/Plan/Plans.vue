<template>
  <v-container fluid grid-list-xl>

    <!-- Show upcoming plans -->
    <v-layout row justify-center>
      <v-flex sm12 md11 lg10 xl9>
        <v-card>
          <v-card-text>

            <v-toolbar color="blue">
              <v-menu open-on-hover bottom right offset-y>
                <v-btn icon slot="activator" dark>
                  <v-toolbar-side-icon></v-toolbar-side-icon>
                </v-btn>
                <v-list>
                  <v-list-tile v-for="item in planMenuItems" :key="item.title" @click="planAction(item.action)">
                    <v-icon>{{ item.icon }}</v-icon>&nbsp;
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>

              <v-toolbar-title class="white--text">All Plans</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>search</v-icon>
              </v-btn>
            </v-toolbar>

            <v-container>
              <v-layout row wrap>

                <v-flex xs12 mb-2 v-if="!plans.length && !loading">
                  There are no Plans.<br>
                  <v-btn v-if="userIsAdmin" :to="{name: 'createplan'}">Create one!</v-btn>
                </v-flex>

                <!-- iterate through each registered plan -->
                <app-show-list-of-plans></app-show-list-of-plans>

              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import genericMixins from '../../mixins/'

export default {
  name: 'AllPlansList',

  mixins: [genericMixins],

  data () {
    return {
      planMenuItems: [
        { icon: 'replay', action: 'refresh', title: 'Refresh Plan List' }
      ]
    }
  },

  computed: {
    plans () {
      return this.$store.getters.plans
    }
  },

  methods: {
    planAction (what) {
      if (what === 'refresh') {
        this.$store.dispatch('refreshPlans')
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
