<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">

      <div>
        <v-toolbar color="cyan" dark tabs>

          <v-toolbar-side-icon></v-toolbar-side-icon>

          <v-toolbar-title>Admin Page</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-text-field
            v-if="searchField"
            label="Search"
            single-line hide-details
            v-model="search.filter"
          ></v-text-field>

          <v-btn icon @click="searchField = !searchField">
            <v-icon>search</v-icon>
          </v-btn>

          <v-btn icon>
            <v-icon>more_vert</v-icon>
          </v-btn>

          <v-tabs 
              color="cyan"
              slot="extension"
              grow
              v-model="admin.selectedTab"
            >
            <v-tabs-slider color="yellow"></v-tabs-slider>

            <v-tab href="#tab-0">
              Page Health
            </v-tab>

            <v-tab href="#tab-1">
              User Roles
            </v-tab>

            <v-tab href="#tab-2">
              Plan Types
            </v-tab>

            <v-tab href="#tab-3">
              Scripture
            </v-tab>

            <v-tab href="#tab-4">
              User List
            </v-tab>


            <v-menu :nudge-width="100" right bottom>
              <v-tab slot="activator">
                Menu
                <v-icon>arrow_drop_down</v-icon>
              </v-tab>
              <v-list class="grey lighten-3">
                <v-list-tile
                    tag="a"
                    v-for="n in 4"
                    :key="n"
                  >
                  Sample Item {{ n }}
                </v-list-tile>
              </v-list>
            </v-menu>
          </v-tabs>
        </v-toolbar>

        <v-tabs-items v-model="admin.selectedTab">

          <v-tab-item id="tab-0">
            <health></health>
          </v-tab-item>

          <v-tab-item id="tab-1">
            <app-admin-role-list></app-admin-role-list>
          </v-tab-item>

          <v-tab-item id="tab-2">
            <app-admin-type-list></app-admin-type-list>
          </v-tab-item>

          <v-tab-item id="tab-3">
            <v-card flat>
              <v-card-text>scripture (WIP)</v-card-text>
            </v-card>
          </v-tab-item>

          <v-tab-item id="tab-4">
            <app-admin-user-list></app-admin-user-list>
          </v-tab-item>

        </v-tabs-items>

      </div>

    </v-slide-y-transition>
  </v-container>
</template>

<script>
  import Health from './Health'

  import genericMixins from '../../mixins/'
  export default {
    components: {Health},
    mixins: [genericMixins],
    data () {
      return {
        searchField: false
      }
    },
    computed: {
      admin () {
        return this.$store.getters.admin
      }
    },
    watch: {
      searchField (val) {
        if (!val) this.search.filter = ''
      }
    },

    mounted () {
      this.$store.commit('setRouteChanging', false)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
