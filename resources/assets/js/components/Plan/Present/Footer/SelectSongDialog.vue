<template>
  <v-layout row justify-center>
    <v-dialog 
        v-model="selectSongDialog"
        min-width="500"
        max-width="700">

      <v-card :dark="dark">

        <v-card-title>
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
            hide-headers=""
            :items="songsArray"
            itemKey="id"
            :search="searchString"
            :rows-per-page-items="[5, 10, 15]"
            no-results-text="No matching songs found"
            class="elevation-1">

          <template slot="items" slot-scope="props">
            <tr class="show-on-hover"
                :class="[props.expanded ? 'blue-grey lighten-2' : '']">

              <td :title="props.item.lyrics">
                <span>{{ props.item.title }}</span>
                <span v-if="props.item.title_2">({{ props.item.title_2 }})</span>

                <v-icon title="add this song to your plan"
                    class="cursor-pointer" color="primary"
                    @click="addSelectedSongToPlan(props.item.id)"
                  >add_circle</v-icon>
              </td>

              <!-- these values are included but invisible, so that they can be searched -->
              <td class="pa-0"><span class="invisible">{{ props.item.title_2 }}</span></td>
              <td class="pa-0"><span class="invisible">{{ props.item.lyrics }}</span></td>
              <td class="pa-0"><span class="invisible">{{ props.item.author }}</span></td>

              <td class="nowrap">
                <span>{{ props.item.book_ref }}</span>

                <!-- modal to show youtube videos -->
                <app-show-youtube-modal v-if="props.item.youtube_id"
                    :youtube-id="props.item.youtube_id"
                  ></app-show-youtube-modal>
              </td>

            </tr>
          </template>

          <template slot="no-data">
            <v-alert :value="true" color="error" icon="warning">
              No songs available yet
            </v-alert>
          </template>

        </v-data-table>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="yellow darken-3" flat="flat" @click.native="cancel">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>  
</template>

<script>
import genericMixins from '../../../../mixins'
import planMixins from '../../mixins'

export default {
  mixins: [genericMixins, planMixins],

  data () {
    return {
      selectSongDialog: false,
      dark: false,
      headers: [
        { text: 'Title', value: 'title', align: 'left', class: 'px-1' },
        { text: 'Subtitle', value: 'title_2', class: 'pa-0', width: '1px' },
        { text: 'Lyrics', value: 'lyrics', class: 'pa-0', width: '1px' },
        { text: 'Author', value: 'author', align: 'left', class: 'pl-4' },
        { text: 'Book Ref.', value: 'book_ref', align: 'left', class: 'px-1' }
      ],
      searchString: ''
    }
  },

  computed: {
    songsArray () {
      let songs = []
      for (const key in this.songs) {
        if (this.songs.hasOwnProperty(key)) {
          const element = this.songs[key];
          songs.push(element)
        }
      }
      return songs
    }
  },

  watch: {
    dialogShow () {
      if (this.dialog.field === 'selectSongDlg') {
        if (this.dialog.dark) this.dark = true
        this.selectSongDialog = true
        this.$store.dispatch('setDialog', {field: ''})
      }
    }
  },

  methods: {
    cancel () {
      this.selectSongDialog = false
      this.$store.dispatch('hideDialog')
    },

    resetItem () {
      this.searchString = ''
    },

    addSelectedSongToPlan (id) {
      if (!id) return
      
      this.$store.dispatch('setDialog', {
        value: id,
        field: 'songSelected'
      })
      this.selectSongDialog = false
      this.$store.dispatch('hideDialog')
    }
  },

  mounted () {
    this.$store.dispatch('setDialog','')
  }
}
</script>
