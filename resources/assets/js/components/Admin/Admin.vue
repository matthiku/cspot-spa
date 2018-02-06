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
                User List
              </v-tab>

              <v-tab href="#tab-1">
                User Roles
              </v-tab>

              <v-tab href="#tab-2">
                Plan Types
              </v-tab>

              <v-tab
                  v-for="(item, i) in items"
                  :key="i"
                  :href="'#tabo-' + (i + 1)"
                >
                {{ item }}
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
                      @click=""
                    >
                    Sample Item {{ n }}
                  </v-list-tile>
                </v-list>
              </v-menu>
            </v-tabs>
          </v-toolbar>

          <v-tabs-items
              v-model="admin.selectedTab">

            <v-tab-item id="tab-0">
              <app-admin-user-list></app-admin-user-list>
            </v-tab-item>

            <v-tab-item id="tab-1">
              <app-admin-role-list></app-admin-role-list>
            </v-tab-item>

            <v-tab-item id="tab-2">
              <app-admin-type-list></app-admin-type-list>
            </v-tab-item>

            <v-tab-item
              v-for="i in 2"
              :key="i"
              :id="'tabo-' + i"
            >
              <v-card flat>
                <v-card-text>{{ text }}</v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>

      </div>

    </v-slide-y-transition>
  </v-container>
</template>

<script>
  import genericMixins from '../../mixins/'
  export default {
    mixins: [genericMixins],
    data () {
      return {
        searchField: false,
        items: [
          'videos', 'images'
        ],
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
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
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
