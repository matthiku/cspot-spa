<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">

      <v-layout column align-center>
        <v-card class="w-100">
          <v-card-title>
            <h2>{{ pageTitle }}</h2>
            <v-spacer></v-spacer>
            <v-text-field
              append-icon="search"
              label="Search"
              clearable
              single-line
              hide-details
              v-model="searchString"
            ></v-text-field>
          </v-card-title>

          <v-data-table
              :headers="headers"
              :items="songs"
              itemKey="key"
              :search="searchString"
              :rows-per-page-items="[10, 15, 25, { text: 'All', value: -1 }]"
              no-results-text="No matching songs found"
              class="elevation-1">

            <template slot="headerCell" slot-scope="props">
              <v-tooltip bottom>
                <span slot="activator">
                  {{ props.header.text }}
                </span>
                <span>
                  click to sort by {{ props.header.text }}
                </span>
              </v-tooltip>
            </template>

            <template slot="items" slot-scope="props">
              <tr class="show-on-hover"
                  :class="[props.expanded ? 'blue-grey lighten-2' : '']">

                <td class="cursor-pointer text-xs-right no-wrap"
                    @click="toggleExpanded(props)"
                    :title="[props.expanded ? 'click for less details' : 'click for more details']"
                  ><v-icon>{{ props.expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}}</v-icon>
                  {{ props.item.id }}
                </td>

                <td :title="props.item.lyrics">
                  <app-edit-song-field
                      v-if="userIsAdmin && props.expanded"
                      :song="props.item"
                      field="title"
                      required="true"
                      maxLength="50"
                    ></app-edit-song-field>
                  <span v-else>{{ props.item.title }}</span>
                  <app-edit-song-field
                      v-if="userIsAdmin && props.expanded"
                      :song="props.item"
                      field="title_2"
                      fieldName="Subtitle"
                      maxLength="50"
                    ></app-edit-song-field>
                  <span v-else-if="props.item.title_2">({{ props.item.title_2 }})</span>

                  <v-btn v-if="addToPlan" @click="addSelectedSongToPlan(props.item.key)"
                      class="on-hover-only" small round fab color="primary"
                      title="add this song to your plan"><v-icon>add</v-icon></v-btn>
                </td>

                <!-- these values are included but invisible, so that they can be searched -->
                <td class="pa-0"><span class="invisible">{{ props.item.title_2 }}</span></td>
                <td class="pa-0"><span class="invisible">{{ props.item.lyrics }}</span></td>

                <td>
                  <app-edit-song-field
                      v-if="userIsAdmin && props.expanded"
                      :song="props.item"
                      field="author"
                      maxLength="40"
                    ></app-edit-song-field>
                  <span v-else>{{ props.item.author }}</span>
                </td>

                <td>
                  <app-edit-song-field
                      v-if="userIsAdmin && props.expanded"
                      :song="props.item"
                      field="book_ref"
                      field-name="Book Reference Number"
                      maxLength="20"
                    ></app-edit-song-field>
                  <span v-else>{{ props.item.book_ref }}</span>
                </td>

                <td class="text-xs-center">
                  <app-edit-song-field
                      v-if="userIsAdmin && props.expanded"
                      :select-items="selectItems"
                      :song="props.item"
                      field="license"
                      field-name="License Type"
                      maxLength="10"
                    ></app-edit-song-field>
                  <span v-else>{{ props.item.license }}</span>
                </td>

                <td class="no-wrap">
                  <app-edit-song-field
                      v-if="userIsAdmin && props.expanded"
                      :song="props.item"
                      field="youtube_id"
                      field-name="Youtube ID"
                      maxLength="15"
                    ></app-edit-song-field>                  
                  <!-- modal to show youtube videos -->
                  <app-show-youtube-modal v-else-if="props.item.youtube_id"
                      :youtube-id="props.item.youtube_id"
                    ></app-show-youtube-modal>
                </td>

              </tr>
            </template>

            <template slot="expand" slot-scope="props">
              <v-card class="grid blue-grey lighten-4">
                <v-container fluid grid-list-md>
                  <v-layout row wrap>

                    <v-flex md4>
                      <h6 class="mb-1 subheading cursor-pointer" 
                          title="show full lyrics"
                          @click="showItemDialog('lyrics')">
                        <v-icon>subject</v-icon> Lyrics:
                      </h6>
                      <app-edit-song-textarea-field
                          v-if="userIsAdmin"
                          :song="props.item"
                          field="lyrics"
                        ></app-edit-song-textarea-field>
                      <pre v-else-if="props.item.lyrics" 
                           title="show full lyrics"
                           @click="showItemDialog('lyrics')"
                           class="grey lighten-3 cursor-pointer pa-1 elevation-5 overflow-hidden">{{ 
                          props.item.lyrics | maxLines(5, 'exact') 
                        }}</pre>
                    </v-flex>

                    <v-flex md4>
                      <h6 class="mb-1 subheading" 
                          :title="[props.item.chords ? 'show full chords' : '']"
                          :class="[props.item.chords ? 'cursor-pointer' : '']" 
                          @click="showItemDialog('chords')">
                        <v-icon>queue_music</v-icon> Chords:
                      </h6>
                      <app-edit-song-textarea-field
                          v-if="userIsAdmin"
                          :song="props.item"
                          field="chords"
                        ></app-edit-song-textarea-field>
                      <pre  v-else-if="props.item.chords" 
                            title="show full chords"
                            @click="showItemDialog('chords')"
                            :class="[props.item.chords ? 'cursor-pointer' : '']" 
                            class="grey lighten-3 pa-1 elevation-5 overflow-hidden">{{ 
                          props.item.chords | maxLines(5, 'exact') 
                        }}</pre>
                      <pre v-else class="grey lighten-3 pa-1 elevation-5 text-xs-center">{{ '\n\n(missing)\n\n\n' }}</pre>
                    </v-flex>

                    <v-flex md4>
                      <!-- 
                          TODO: this module should be a component! 
                      -->
                      <h6 class="mb-1 subheading"><v-icon>reorder</v-icon> Other Data:</h6>
                      <v-card style="height: 103px; line-height: 1.7;"
                       class="grey lighten-3 pa-1 elevation-5 overflow-hidden">
                        <v-card-text class="pa-0">
                          <app-edit-song-field
                            v-if="userIsAdmin"
                            :song="props.item"
                            field="sequence"
                            field-name="Song Parts Seq."
                            show-label
                            maxLength="50"
                          ></app-edit-song-field>
                          <span v-else>
                            <span class="body-2 no-wrap">Song Parts Seq.:&nbsp;</span>
                            {{ props.item.sequence || 'n/a' }}</span>
                        </v-card-text>
                        <v-card-text class="pa-0">
                          <app-edit-song-field
                            v-if="userIsAdmin"
                            :song="props.item"
                            field="ccli_no"
                            field-name="CCLI Number"
                            show-label
                            maxLength="15"
                          ></app-edit-song-field>
                          <span v-else>
                            <span class="body-2 no-wrap">CCLI Number:</span>
                            {{ props.item.ccli_no || 'n/a' }}</span>
                        </v-card-text>
                        <v-card-text class="pa-0">
                          <app-edit-song-field
                            v-if="userIsAdmin"
                            :song="props.item"
                            field="hymnaldotnet_id"
                            field-name="Hymnal.Net ID"
                            show-label
                            maxLength="15"
                          ></app-edit-song-field>
                          <span v-else>
                            <span class="body-2 no-wrap">Hymnal.Net ID:</span>
                            {{ props.item.hymnaldotnet_id || 'n/a' }}</span>
                        </v-card-text>
                        <v-card-text class="pa-0">
                          <app-edit-song-field
                            v-if="userIsAdmin"
                            :song="props.item"
                            showLabel
                            field="link"
                            field-name="Other links"
                            maxLength="-1"
                          ></app-edit-song-field>
                          <span v-else>
                            <span class="body-2 no-wrap">Other links:</span>
                            {{ props.item.link || 'n/a' }}</span>
                        </v-card-text>
                      </v-card>

                    </v-flex>

                    <!-- provide further actions for this song -->
                    <v-tooltip lazy bottom>
                      <v-speed-dial v-model="fab" top right absolute direction="left" slot="activator">
                        <v-btn dark fab hover
                            color="blue darken-2"
                            slot="activator"
                            v-model="fab">
                          <v-icon>settings</v-icon>
                          <v-icon>close</v-icon>
                        </v-btn>
                        <v-tooltip bottom>
                          <v-btn @click.native.stop="planAddDialog = true"
                              fab dark small color="cyan" slot="activator">
                            <v-icon>add</v-icon>
                          </v-btn>
                          <span>Add to Plan</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <v-btn fab dark small color="green" slot="activator">
                            <v-icon>airplay</v-icon>
                          </v-btn>
                          <span>Start Lyrics Presentation</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <v-btn @click.native.stop="showItemDialog('lyrics')"
                              fab dark small color="indigo" slot="activator">
                            <v-icon>subject</v-icon>
                          </v-btn>
                          <span>Show Lyrics</span>
                        </v-tooltip>
                        <v-tooltip bottom v-if="props.item.chords">
                          <v-btn @click.native.stop="showItemDialog('chords')"
                               fab dark small color="indigo" slot="activator">
                            <v-icon>queue_music</v-icon>
                          </v-btn>
                          <span>Show Chords</span>
                        </v-tooltip>
                        <v-tooltip bottom v-if="props.item.sheetmusic">
                          <v-btn fab dark small color="red" slot="activator">
                            <v-icon>music_video</v-icon>
                          </v-btn>
                          <span>Show Sheetmusic (if any)</span>
                        </v-tooltip>
                      </v-speed-dial>
                      <span>show actions</span>
                    </v-tooltip>

                    <v-dialog v-model="itemDialog.show" max-width="500px" lazy>
                      <v-card>
                        <v-card-title class="headline py-0">
                          Song {{ itemDialog.what | ucFirst }}
                          <v-spacer></v-spacer>
                          <v-btn color="green darken-1" round small fab flat @click.native="itemDialog.show = false"><v-icon>close</v-icon></v-btn>
                        </v-card-title>
                        <v-card-text class="pt-0">
                          <pre>{{ props.item[itemDialog.what] }}</pre>
                        </v-card-text>
                      </v-card>
                    </v-dialog>

                    <v-dialog v-model="planAddDialog" max-width="600px" lazy>
                      <v-card>
                        <v-card-title class="headline pt-0 pb-0">
                          Select a plan to add this song to:
                          <v-spacer></v-spacer>
                          <v-btn color="green darken-1" class="ma-0" round fab flat @click.native="planAddDialog = false"><v-icon>close</v-icon></v-btn>
                        </v-card-title>
                        <v-card-text class="pt-1">

                          <app-show-simple-plan-list :planList="planList"></app-show-simple-plan-list>

                          <v-switch class="mt-1"
                              label="Open selected plan after adding the song"
                              v-model="openPlanAfterAddingSong" 
                            ></v-switch>
                        </v-card-text>
                        <v-card-actions>
                          <v-btn 
                              :disabled="!dialog.selectedPlan"
                              color="green darken-1" round small block 
                              @click.native="addSelectedSongToPlan(props.item.key)"> <v-icon>add</v-icon> Add</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>

                  </v-layout>
                  onsong chords?
                </v-container>
              </v-card>
            </template>

            <template slot="no-data">
              <v-alert :value="true" color="error" icon="warning">
                No songs available yet
              </v-alert>
            </template>

          </v-data-table>
        </v-card>
      </v-layout>

    </v-slide-y-transition>
  </v-container>
</template>


<script>
  import genericMixins from '../../mixins/'
  import planMixins from '../Plan/mixins'

  export default {
    name: 'SongList',

    mixins: [genericMixins, planMixins],

    data () {
      return {
        pageTitle: 'Song Repository',
        addToPlan: false,
        fab: false,
        planAddDialog: false,
        planList: [],
        openPlanAfterAddingSong: true,
        itemDialog: {
          show: false,
          what: ''
        },
        headers: [
          { text: 'id', value: 'id', align: 'center', class: 'px-1' },
          { text: 'Title', value: 'title', align: 'left', class: 'px-1' },
          { text: ' ', value: 'title_2', class: 'pa-0', width: '1px' },
          { text: '', value: 'lyrics', class: 'pa-0', width: '1px' },
          { text: 'Author', value: 'author', align: 'left', class: 'pl-4' },
          { text: 'Book Ref.', value: 'book_ref', align: 'left', class: 'px-1' },
          { text: 'License', value: 'license', align: 'center', class: 'pl-0' },
          { text: 'Clip', value: 'youtube_id', align: 'center', class: 'pl-0' }
        ],
        selectItems: [
          { text: 'PD' },
          { text: 'CCLI' },
          { text: 'Unknown' },
          { text: 'Other' }
        ],
        standAlone: true,
        searchString: ''
      }
    },

    computed: {
      upcomingPlans () {
        return this.$store.getters.futurePlans
      }
    },
    watch: {
      upcomingPlans () {
        this.createPlanList()
      },
      types () {
        this.createPlanList()
      },
      users () {
        this.createPlanList()
      }
    },

    created () {
      // only show title when this is not a component of the Admin page
      this.standAlone = (this.$route.name === 'admin')

      if (this.$route.name === 'addsongtoplan' && this.dialog.selectedPlan) {
        this.pageTitle = 'Select a Song to add to your Plan:'
        this.addToPlan = true
      }

      this.createPlanList()
    },

    methods: {
      createPlanList () {
        // wait until the types list is populated
        if (!this.types || !this.users) return

        this.planList = []
        this.upcomingPlans.forEach(element => {
          if (this.userOwnsPlan(element)) {
            let leader = this.findRoleInStaff('leader', element.staff)
            let teacher = this.findRoleInStaff('teacher', element.staff)
            this.planList.push({
              id: element.id,
              date: element.date,
              type: this.types[element.typeId].name,
              items: element.items ? Object.keys(element.items).length : 0,
              leader: leader ? leader.name : 'none',
              teacher: teacher ? teacher.name : 'none'
            })
          }
        })
      },
      showItemDialog (what) {
        this.itemDialog.show = true
        this.itemDialog.what = what
      },
      toggleExpanded (props) {
        props.expanded = !props.expanded
        if (!props.expanded) this.fab = false
      },
      addSelectedSongToPlan (id) {
        if (!id || !this.dialog.selectedPlan || isNaN(this.dialog.seqNo)) return

        this.planAddDialog = false
        this.$store.dispatch('addActionItemToPlan', {
          value: id,
          planId: this.dialog.selectedPlan,
          type: 'song',
          seqNo: this.dialog.seqNo
        })

        if (this.openPlanAfterAddingSong) {
          this.$router.push({name: 'plan', params: { planId: this.dialog.selectedPlan }})
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
