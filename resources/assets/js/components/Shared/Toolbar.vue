<template>
  <span>

    <!-- left-handed navigation -->
    <v-navigation-drawer
      v-if="userIsAuthenticated"
      :clipped="clipped"
      v-model="drawer"
      floating
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


    <!-- small devices only: drawer for right-hand menu -->
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


    <v-toolbar fixed app :clipped-left="clipped" class="white--text primary">

      <v-toolbar-side-icon 
        v-if="userIsAuthenticated"
        @click.stop="drawer = !drawer"
      ></v-toolbar-side-icon>

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
  </span>
</template>

<script>
import genericMixins from '../../mixins/'

export default {
  mixins: [genericMixins],

  data () {
    return {
      appTitle: 'c-SPOT-SPA',
      rightDrawer: false,
      clipped: true,
      drawer: true,
      right: true
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

  methods: {
    onLogout () {
      this.rightDrawer = false
      this.$store.dispatch('signUserOut')
    }
  }
}
</script>
