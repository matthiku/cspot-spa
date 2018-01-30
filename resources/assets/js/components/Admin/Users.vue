<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">

      <v-layout column align-center>
        <h2 v-if="!standAlone">User List</h2>

        <v-data-table
            v-bind:headers="headers"
            :items="userList"
            :search="search.filter"
            hide-actions
            class="elevation-1"
          >
          <template slot="items" slot-scope="props">
            <router-link
                tag="td"
                :to="{name: 'user', params: {userId: props.item.id}}"
                title="click to edit this profile"
                style="cursor: pointer"
              >{{ props.item.id }}</router-link>

            <td class="text-xs-right">{{ props.item.name }}
              <v-avatar size="30px" v-if="props.item.providerData && props.item.providerData[0].photoURL">
                <img :src="props.item.providerData[0].photoURL" alt="avatar">
              </v-avatar>
            </td>

            <td class="text-xs-right mr-0 pr-0">
              {{ props.item.email }}
              <v-icon :color="props.item.verified ? 'green' : 'red'">{{ props.item.verified ? 'check' : 'close' }}</v-icon>
            </td>

            <td class="text-xs-right">
              <span v-for="(role, key) in props.item.roles" :key="key">
                {{ role }}<span v-if="key + 1 < props.item.roles.length">, </span>
              </span>
            </td>
          </template>
        </v-data-table>
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
          { text: 'id', value: 'id', align: 'left', sortable: false },
          { text: 'Name', value: 'name' },
          { text: 'Email Address - Verified?', value: 'email', class: 'mr-0 pr-0' },
          { text: 'Role(s)', value: 'roles' }
        ],
        standAlone: true,
        userList: []
      }
    },
    created () {
      // only show title when this is no a component of the Admin page
      this.standAlone = this.$route.name === 'admin'

      if (this.userIsAdmin) {
        this.headers[0].text = 'id (click id to edit item)'
      }
      this.updateUsersList()
    },
    watch: {
      users () {
        this.updateUsersList()
      }
    },
    methods: {
      updateUsersList () {
        this.userList = []
        // morph the users object into an array of users
        for (let key in this.users) {
          this.userList.push(this.users[key])
        }
      }
    }
  }
</script>
