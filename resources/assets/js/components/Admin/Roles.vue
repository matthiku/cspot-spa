<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">

      <v-layout column align-center>

        <app-admin-edit-field-dialog></app-admin-edit-field-dialog>

        <v-data-table
            v-bind:headers="headers"
            :items="rolesList"
            :search="search.filter"
            hide-actions
            class="elevation-1"
          >
          <template slot="items" slot-scope="props">

            <td class="text-xs-right">{{ props.item.id }}</td>

            <td class="text-xs-right" @click="editField('icon', props.item)">
              <small>({{ props.item.icon }})</small>
              <v-icon v-if="props.item.icon">{{ props.item.icon }}</v-icon>
            </td>

            <td class="text-xs-right" @click="editField('name', props.item)">{{ props.item.name }}</td>

            <td class="text-xs-right" @click="updateEvent(props.item)">
              <v-checkbox v-model="props.item.forEvents" light></v-checkbox>
            </td>

            <td class="text-xs-right" v-if="users">
              <span v-for="(ok, id, index) in props.item.users" :key="index">
                <v-chip small
                  @click="gotoUserProfile(users[id].id)"
                  class="cursor-pointer"
                  :title="users[id].name">
                  <v-avatar v-if="users[id].providerData && users[id].providerData[0].photoURL">
                    <img :src="users[id].providerData[0].photoURL" alt="avatar">
                  </v-avatar>
                  {{ users[id].name | firstWord }}
                </v-chip>
              </span>

              <v-btn
                v-if="!props.item.users"
                color="error" fab small dark
                @click="removeRole(props.item)"
                class="ma-0">
                <v-icon>delete</v-icon>
              </v-btn>
            </td>

          </template>
        </v-data-table>
        <v-btn color="primary" @click="addRole">add role</v-btn>
      </v-layout>

    </v-slide-y-transition>
  </v-container>
</template>

<script>
  import genericMixins from '../../mixins/'

  export default {
    mixins: [genericMixins],
    data () {
      return {
        headers: [
          { text: 'Id', value: 'id' },
          { text: 'Icon', value: 'icon' },
          { text: 'Name', value: 'name' },
          { text: 'For Events?', value: 'forEvents' },
          { text: 'User(s)', value: 'users' }
        ],
        rolesList: []
      }
    },
    created () {
      this.updateRolesList()
      this.$store.dispatch('hideDialog')
    },
    watch: {
      roles () {
        this.updateRolesList()
      },
      dialogShow (val) {
        if (!this.dialog.updated ||
          this.dialog.type !== 'role') return

        this.$store.dispatch('updateRole', {
          id: this.dialog.item.id,
          field: this.dialog.field,
          value: this.dialog.item[this.dialog.field]
        })
      }
    },
    methods: {
      updateRolesList () {
        this.rolesList = []
        // morph the roles object into an array of roles
        for (let key in this.roles) {
          let data = {id: key}
          Object.assign(data, this.roles[key])
          this.rolesList.push(data)
        }
      },
      editField (field, what) {
        if (!this.userIsAdmin) return
        this.$store.dispatch('setDialog', {field, item: what, type: 'role'})
        this.$store.dispatch('showDialog')
      },
      addRole () {
        if (!this.userIsAdmin) return
        this.$store.dispatch('addDummyRole', {id: 'new', name: ''})
        this.$store.dispatch('setDialog', {field: 'name', item: this.roles.new, type: 'role'})
        this.$store.dispatch('showDialog')
      },
      removeRole (role) {
        if (!this.userIsAdmin) return
        this.$store.dispatch('removeRole', role)
      },
      gotoUserProfile (id) {
        this.$router.push({name: 'user', params: {userId: id}})
      },
      updateEvent (event) {
        this.$store.dispatch('updateRole', {
          id: event.id,
          field: 'forEvents',
          value: event.forEvents
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
