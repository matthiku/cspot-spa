<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialogShow" persistent max-width="500px">
      <!-- <v-btn color="primary" dark slot="activator">Open Dialog</v-btn> -->
      <v-card v-if="dialog.field">

        <v-card-title>
          <span class="headline" v-if="dialog.type">Create new {{ dialog.type }}:</span>
          <span class="headline" v-else-if="dialog.item && dialog.item.name">Edit {{ dialog.field }} of '{{ dialog.item.name }}'</span>
        </v-card-title>

        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>

              <v-flex xs12>
                <span v-if="dialog.selcct">Enter the value</span>
                <v-text-field
                  ref="inputfield"
                  :label="dialog.field"
                  v-model="dialog.item[dialog.field]" 
                  @keyup.enter="closeDialog(false)"
                  autofocus required>
                </v-text-field>
              </v-flex>

              <v-flex xs12 v-if="dialog.select && dialog.select !== 'time'">
                Or use the selection box:
                <v-select
                  v-bind:items="dialog.select"
                  ref="selectfield"
                  :label="dialog.field"
                  v-model="dialog.item[dialog.field]" 
                  single-line bottom>
                </v-select>
              </v-flex>

              <v-flex xs12 v-if="dialog.select && dialog.select === 'time'">
                <v-time-picker 
                  no-title format="24hr"
                  v-model="dialog.item[dialog.field]">
                </v-time-picker>
              </v-flex>

            </v-layout>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="closeDialog(true)">Close</v-btn>
          <v-btn color="blue darken-1" flat @click.native="closeDialog(false)">Save</v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  import genericMixins from '../../../mixins/'

  export default {
    mixins: [genericMixins],

    methods: {
      closeDialog (close) {
        this.$store.dispatch('hideDialog')
        if (close || this.$refs.inputfield.initialValue === this.$refs.inputfield.value) return
        this.dialog.updated = true
      }
    }
  }
</script>