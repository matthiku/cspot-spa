<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">

      <v-card>
        <v-card-title>

          <h2 v-if="!standAlone">User List</h2>
          <v-spacer></v-spacer>

          <v-text-field
              append-icon="search"
              label="Search"
              single-line
              hide-details
              v-model="search.filter"
            ></v-text-field>

          <v-btn title="reset the search" small round @click="search.filter=null">clear</v-btn>

        </v-card-title>


        <v-data-table
            v-bind:headers="headers"
            :items="userList"
            :search="search.filter"
            hide-actions
            class="elevation-1"
          >
          <template 
              slot="items"
              slot-scope="props"
            >
            <tr 
                @click="editProfile(props.item.id)"
                style="cursor: pointer"
                title="click to edit this profile"
              >
              <td>{{ props.item.id }}</td>

              <td>{{ props.item.name }}
                <v-avatar size="30px" v-if="props.item.providerData && props.item.providerData[0].photoURL">
                  <img :src="props.item.providerData[0].photoURL" alt="avatar">
                </v-avatar>
              </td>

              <td>
                {{ props.item.last_name }},
                {{ props.item.first_name }}
              </td>

              <td class="text-xs-right mr-0 pr-0">
                {{ props.item.email }}
                <v-icon :color="props.item.verified ? 'green' : 'red'">{{ props.item.verified ? 'check' : 'close' }}</v-icon>
              </td>

              <td :title="props.item.last_access">
                <span v-if="props.item.last_access">{{ props.item.last_access | dateShort }}</span>
              </td>

              <td class="text-xs-right small">
                <span v-for="(role, key) in props.item.roles" :key="role.id">
                  {{ role.name | ucFirst }}<span v-if="key + 1 < props.item.roles.length">, </span>
                </span>
              </td>
            </tr>
          </template>
        </v-data-table>

      </v-card>

    </v-slide-y-transition>
  </v-container>
</template>

<style>
  .small {
    font-size: 75% !important;
  }
</style>


<script>
  import genericMixins from '../../mixins/'

  export default {
    mixins: [genericMixins],
    data () {
      return {
        headers: [
          { text: 'id', value: 'id', align: 'left' },
          { text: 'User Name', value: 'name' },
          { text: 'Full Name', value: 'last_name' },
          { text: 'Email Address - Verified?', value: 'email', class: 'mr-0 pr-0', align: 'right' },
          { text: 'Last Access', value: 'last_access', align: 'left' },
          { text: 'Role(s)', value: 'roles', align: 'right' }
        ],
        standAlone: true,
        userList: []
      }
    },
    created () {
      // only show title when this is not a component of the Admin page
      this.standAlone = this.$route.name === 'admin'

      this.updateUsersList()
    },
    watch: {
      users () {
        this.updateUsersList()
      }
    },
    methods: {
      editProfile (id) {
        this.$router.push({name: 'user', params: {userId: id}})
      },
      updateUsersList () {
        this.userList = []
        if (this.users === 'loading') return

        // morph the users object into an array of users
        for (let key in this.users) {
          this.userList.push(this.users[key])
        }
      }
    }
  }
</script>
