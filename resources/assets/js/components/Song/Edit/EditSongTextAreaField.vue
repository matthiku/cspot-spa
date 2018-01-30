<template>
  <div>

    <pre title="click to edit"
         @click="dialog = !dialog"
         :class="[song[field] ? '' : 'grey--text text-xs-center']"
         class="grey lighten-3 pa-1 elevation-5 cursor-pointer overflow-hidden"
      >{{ 
      song[field] | maxLines(5) || '\n\n(click to add ' + field + ')\n\n\n' }}</pre>

    <v-dialog v-model="dialog" max-width="600px" lazy>
      <v-card>
        <v-card-text class="pb-0">

          <v-text-field class="pb-0"
            slot="input"
            :label="'Edit ' + field"
            v-model="song[field]"
            :rows="rows"
            @keydown.ctrl.enter="updateSong()"
            multi-line
            full-width
            counter autofocus
          ></v-text-field>

        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="resetField">Cancel</v-btn>
          <v-btn color="green darken-1" flat @click.native="updateSong(song.id)">Save</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>

    </v-dialog>
  </div>
</template>

<script>
  export default {
    props: ['song', 'field'],

    data () {
      return {
        dialog: false,
        rows: 5,
        initialValue: ''
      }
    },

    methods: {
      updateSong () {
        // check if there even were any changes
        if (this.initialValue.trim() === this.song[this.field].trim()) return
        this.dialog = false

        let value = this.song[this.field] || ''
        this.$store.dispatch('updateSong', {id: this.song.key, field: this.field, value})
        this.initialValue = value
      },

      resetField () {
        this.dialog = false
        this.song[this.field] = this.initialValue
      }
    },

    created () {
      // save the initial value in order to check if it was actually changed for updating
      this.initialValue = this.song[this.field]

      this.rows = Math.max(this.song[this.field].split('\n').length + 1, 5)
    }
  }
</script>
