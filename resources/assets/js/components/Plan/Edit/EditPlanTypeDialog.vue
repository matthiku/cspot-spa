<template>
  <v-dialog v-model="typeEditingDlg" max-width="500px">

    <v-btn flat icon color="gray"
      class="ma-0 pl-0"
      title="edit plan type"
      @click.stop="typeEditingDlg = true" 
      slot="activator"
    ><v-icon class="grey--text lighten-1">edit</v-icon></v-btn>

    <v-card>
      <v-card-title>
        <h5>Edit Plan Type</h5>
        
      </v-card-title>

      <v-card-text>
        <template>
          <v-layout row wrap>
            <v-flex xs12>
              Select:
              <v-select
                v-bind:items="types"
                v-model="type"
                return-object
                item-text="name"
                item-value="id"
                label="Select Event Type:"
                hint="(this will not change any existing plan items)"
                single-line dense
                persistent-hint
              ></v-select>              
            </v-flex>

          </v-layout>
        </template>
      </v-card-text>
      <v-card-actions>
        <v-btn color="secondary" flat @click.stop="typeEditingDlg=false">Close</v-btn>
        <v-btn color="primary" flat @click.stop="saveType">Submit</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>

  </v-dialog>
</template>

<script>
import genericMixins from '../../../mixins'
import planMixins from '../mixins'

export default {
  name: 'editPlanTypeDialog',
  props: ['plan'],
  mixins: [genericMixins, planMixins],

  data () {
    return {
      typeEditingDlg: false,
      type: {},
      oldType: null
    }
  },

  methods: {
    saveType () {
      this.typeEditingDlg = false
      if (this.type.id === this.oldType) return
      this.plan.typeId = this.type.id
      this.$store.dispatch('updatePlan', {
        id: this.plan.id,
        field: 'typeId',
        value: this.type.id
      })
    }
  },

  created () {
    if (!this.plan) return
    this.oldType = this.plan.typeId
    this.$store.dispatch('hideDialog')
    this.type = { id: this.plan.typeId, name: this.types[this.plan.typeId].name }
  },

  watch: {
    // checking if parents wants this component to appear!
    dialogShow () {
      if (this.dialog.type !== 'type') return
      this.typeEditingDlg = this.dialogShow
    },
    typeEditingDlg (val) {
      if (!val) this.$store.dispatch('hideDialog')
    }
  }
}
</script>
