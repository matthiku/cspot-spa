<template>
  <v-app>

    <!-- left-handed navigation -->
    <v-navigation-drawer
      v-if="userIsAuthenticated"
      :clipped="clipped"
      v-model="drawer"
      floating
      absolute
      app>
      <v-list>
        <v-list-tile ripple
            v-for="(item, i) in menuItems"
            :key="i"
            :to="{ name: item.link }"
            value="true"
            v-if="(item.auth!='admin' || item.auth=='admin' && userIsAdmin) && item.where!='toolbar'"
          >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>


    <v-toolbar fixed app :clipped-left="clipped" class="white--text primary">

      <v-toolbar-side-icon 
        v-if="userIsAuthenticated"
        @click.stop="drawer = !drawer"
      ></v-toolbar-side-icon>
      <!-- REMOVED:
        :class="[ userIsAdmin ? '' : 'hidden-lg-and-up' ]" -->

      <v-btn icon :to="{ name: 'home' }" class="mr-3">
        <img src="/static/cspoticon36.png" alt="c-SPOT icon" width="30px">
      </v-btn>

      <keep-alive>
        <router-link
          class="mr-3"
          tag="v-toolbar-title"
          :to="{ name: 'home' }" 
          style="cursor: pointer"
          v-text="appTitle">
        </router-link>
      </keep-alive>

      <v-toolbar-items class="hidden-xs-only">        
        <v-btn flat
          class="white--text"
          v-for="(item, i) in menuItems"
          :key="i"
          :to="{ name: item.link}"
          v-if="(item.auth!='admin' || (item.auth=='admin' && userIsAdmin)) && item.where!='drawer'"
        >
          <v-badge v-if="item.note" color="red">
            <v-icon slot="badge" dark>notifications</v-icon>
            <v-icon>{{ item.icon }}</v-icon>{{ item.title }}
          </v-badge>
          <span v-else><v-icon>{{ item.icon }}</v-icon>{{ item.title }}</span>
        </v-btn>
      </v-toolbar-items>

      <v-spacer></v-spacer>

      <v-toolbar-items class="hidden-xs-only" v-if="userIsAuthenticated">
        <v-btn flat
          class="white--text"
          @click="onLogout">
          <v-icon>lock_open</v-icon>Logout
        </v-btn>
      </v-toolbar-items>

      <v-btn icon 
        @click.stop="rightDrawer = !rightDrawer"
        class="hidden-sm-and-up">
        <v-icon>menu</v-icon>
      </v-btn>
    </v-toolbar>

    <v-content>

      <v-flex xs12 v-if="loading">
        <v-progress-linear class="ma-0 pa-0" v-bind:indeterminate="true"></v-progress-linear>
      </v-flex>

      <!-- Alert Panel -->
      <v-container class="pa-0" v-if="error">
        <v-layout row>
          <v-flex xs12>
            <app-alert v-if="error" @dismissed="onDismissed('clearError')" :text="error"></app-alert>
          </v-flex>
        </v-layout>
      </v-container>

      <transition name="fade">
        <router-view></router-view>
      </transition>

      <v-snackbar
        transition="fade-transition"
        :timeout="timeout"
        color="info" multi-line vertical
        v-model="showMessage"
      >
        {{ message }}
        <v-btn dark flat @click.native="onDismissed('clearMessage')">Close</v-btn>
      </v-snackbar>

    </v-content>


    <v-navigation-drawer
      temporary clipped
      :right="right"
      v-model="rightDrawer"
      class="hidden-sm-and-up"
      app>
      <v-list>
        <v-list-tile v-if="userIsAuthenticated" @click="onLogout">
          <v-list-tile-action>
            <v-icon>lock_open</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Logout</v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-else
          v-for="(item, i) in menuItems"
          :key="i"
          :to="{ name: item.link }"
          value="true"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-footer fixed app>
      c-SPOT-ify
      <span class="hidden-sm-and-down"><a target="new" href="https://github.com/matthiku/cspot-ify" class="mx-2">GitHub</a>
        <a target="new" href="https://github.com/matthiku/cspot-ify/issues">Issues</a>
        <a target="new" class="ml-3" href="https://console.firebase.google.com/project/cspot-ify/database/cspot-ify/data">Firebase</a>
      </span>
      <v-spacer></v-spacer>
      <small class="hidden-xs-only">the <a target="new" href="https://github.com/matthiku/cspot">c-SPOT</a> Frontend Project</small>
      <v-spacer></v-spacer>
      <span>&copy; 2017 <a href="https://github.com/matthiku" target="new">Matthias Kuhs</a></span>
    </v-footer>

  </v-app>
</template>


<script>
  import genericMixins from './mixins/'

  export default {
    name: 'mainApp',
    mixins: [genericMixins],

    data () {
      return {
        appTitle: 'c-SPOT',
        rightDrawer: false,
        clipped: true,
        drawer: true,
        right: true,
        timeout: 8500,
        showMessage: false
      }
    },
    computed: {
      menuItems () {
        let menuItems = [
          {
            icon: 'face',
            title: 'Sign in',
            link: 'signin',
            auth: false,
            where: 'toolbar'
          },
          {
            icon: 'lock_open',
            title: 'Sign up',
            link: 'signup',
            auth: false,
            where: 'toolbar'
          }
        ]
        if (this.userIsAuthenticated) {
          menuItems = [
            {
              icon: 'bubble_chart',
              title: 'Administration',
              link: 'admin',
              auth: 'admin',
              where: 'both'
            },
            {
              icon: 'group',
              title: 'User List',
              link: 'users',
              auth: 'admin',
              where: 'drawer'
            },
            {
              icon: 'note_add',
              title: 'Create Plan',
              link: 'createplan',
              auth: 'admin',
              where: 'drawer'
            },
            {
              icon: 'record_voice_over',
              title: 'Songs',
              link: 'songs',
              auth: 'user',
              where: 'drawer'
            },
            {
              icon: 'change_history',
              title: 'Next Sunday',
              link: 'nextsunday',
              auth: 'user',
              where: 'both'
            },
            {
              icon: 'notes',
              title: 'All Plans',
              link: 'plans',
              auth: 'user',
              where: 'drawer'
            },
            {
              icon: 'perm_identity',
              title: 'Profile',
              link: 'profile',
              auth: 'user',
              note: !this.userIsVerified,
              where: 'both'
            }
          ]
        }
        return menuItems
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsVerified () {
        return this.$store.getters.user && this.$store.getters.user.verified
      }
    },
    watch: {
      message () {
        this.showMessage = this.message
      }
    },
    methods: {
      onLogout () {
        this.rightDrawer = false
        this.$store.dispatch('signUserOut')
      }
    }
  }

</script>

<style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
