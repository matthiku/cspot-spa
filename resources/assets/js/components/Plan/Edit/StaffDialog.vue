<template>
  <v-dialog v-model="staffEditingDlg" max-width="500px">

    <v-btn small
      class="primary ma-0 pl-0"
      title="add staff"
      @click.stop="startAdding" 
      slot="activator"
    >Add Personell &nbsp;<v-icon class="white--text">edit</v-icon></v-btn>

    <v-card>
      <v-card-title>
        <div>
          <h5 class="headline mb-0">Add/Edit Staff</h5>
          <div>First, select the task; then the person</div> 
        </div>
      </v-card-title>

      <v-card-text>
        <template>
          <v-layout row wrap>
            <v-flex xs12 sm6 class="pr-2">

              <v-select
                v-bind:items="rolesList"
                v-model="role"
                class="input-group--focused"
                label="Select task:"               
                single-line return-object
              ></v-select>              
            </v-flex>

            <v-flex xs12 sm6>
              <v-select
                v-bind:items="usersList"
                v-model="person"
                :disabled="!role"
                item-text="name"
                item-value="id"
                label="Select person:"
                single-line return-object
              ></v-select>              
            </v-flex>

          </v-layout>
        </template>
      </v-card-text>

      <v-card-actions>
        <v-btn color="secondary" flat @click.stop="staffEditingDlg=false">Close</v-btn>
        <v-btn color="primary" flat @click.stop="saveStaff">Submit</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
      
    </v-card>

  </v-dialog>
</template>

<script>
import genericMixins from '../../../mixins'
import planMixins from '../mixins'

export default {
  name: 'editPlanStaffDialog',
  mixins: [genericMixins, planMixins],

  data () {
    return {
      staffEditingDlg: false,
      usersList: [],
      role: null,
      person: null
    }
  },

  computed: {
    rolesList () {
      let rl = []
      for (const key in this.roles) {
        if (this.roles.hasOwnProperty(key)) {
          const role = this.roles[key]
          if (role.for_events) {
            rl.push({text: role.name, value: role.id})
          }
        }
      }
      return rl
    }
  },

  methods: {
    startAdding () {
      this.staffEditingDlg = true
      // if staffList is still empty, pre-select role 'leader'
      //TODO: the value '5' for leader must be computed !! !! ================================== TODO ==== TODO
      if (!this.plan.teams || !this.plan.teams.length) this.role = {text: 'leader', value: 5}
    },
    saveStaff () {
      this.staffEditingDlg = false
      this.$store.dispatch('addStaffToPlan', {
        planId: this.plan.id,
        roleId: this.role.value,
        role:   this.role.text,
        userId: this.person.id,
        name:   this.person.name
      }).then((data) => {
        this.person = null
        this.role = null
      })
    }
  },

  created () {
    if (!this.plan) return
    this.$store.dispatch('hideDialog')
  },

  watch: {

    // filter list of users according to the role selected!
    role (val) {
      if (!val) return
      let role = val.value
      if (!role || !this.roles[role]) return

      this.usersList = []
      this.roles[role].users.forEach((user) => {
        this.usersList.push({ 
          id: this.users[user.id].id,
          name: this.users[user.id].name || this.users[user.id].email 
        })
      })
      // already select the user in the form if there's only one
      if (this.usersList.length === 1) {
        this.person = this.usersList[0]
      }
    },

    // checking if parent wants this component to appear!
    dialogShow () {
      if (this.dialog.type !== 'staff') return
      this.staffEditingDlg = this.dialogShow
    },
    staffEditingDlg (val) {
      if (!val) this.$store.dispatch('hideDialog')
    }
  }
}
</script>
