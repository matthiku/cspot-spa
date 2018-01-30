<template>
  <v-container fluid px-0>
    <v-slide-y-transition mode="out-in">

    <v-layout row justify-center>
      <v-flex sm12 md10 lg8 xl6>
        <v-card>
          <v-card-text class="pa-2">

            <v-container fluid px-0>
              <v-layout>
                <v-flex xs12 v-if="userData">

                  <v-card-title>
                    <h4><span v-if="ownProfile">Your</span><span v-else>A</span> User Profile</h4>
                    <v-spacer></v-spacer>
                    <v-avatar
                        size="60"
                        class="grey lighten-4">
                      <img 
                        v-if="userData.providerData && userData.providerData.length && userData.providerData[0].photoURL"
                        style="max-height:60px!important"
                        :src="userData.providerData[0].photoURL" :alt="userData.displayName">
                      <img v-else style="max-height:60px!important" src="\static\cspoticon72.png" alt="this could be your photo!">
                    </v-avatar>
                  </v-card-title>

                  <v-form ref="form" lazy-validation v-model="valid">

                    <v-text-field label="Name"
                        v-model="userData.name"
                        @keyup.enter="submit"
                      >
                    </v-text-field>

                    <v-layout row wrap>
                      <v-flex xs12 sm10 md8>
                        <v-text-field label="E-mail" class="mb-0 pb-0"
                            v-model="userData.email"
                            @keyup.enter="submit"
                            :rules="emailRules"
                            required
                          ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm2 md4>
                        <div class="ml-3 mb-0" :class="[userData.verified ? '' : 'red--text']">
                          <v-icon class="primary--text">
                            {{ userData.verified ? 'done' : 'warning' }}
                          </v-icon>
                          Email {{ userData.verified ? 'verified' : 'unverified!' }}
                          <span v-if="!userData.verified && user.id === userData.id" class="small">You have only limited access.</span>
                        </div>
                      </v-flex>
                    </v-layout>

                    <v-layout row class="mt-3">
                      <label>Assign<span v-if="!userIsAdmin">ed</span> Roles:</label>
                    </v-layout>
                    <v-layout row wrap class="mt-0">
                      <span v-if="!rolesList">No roles available!</span>
                      <v-flex sm3 lg2 xl1 class="my-0"
                        v-for="(role, index) in rolesList"
                        :key="index">
                        <v-checkbox 
                            v-bind:label="role"
                            :disabled="!userIsAdmin"
                            :title="role"
                            :value="role"
                            v-model="userRoles" light
                          ></v-checkbox>
                      </v-flex>
                    </v-layout>

                    <div>
                      <span class="caption">Profile completion:</span>
                      <v-progress-linear class="mt-0 pt-0" v-model="profileComplete"></v-progress-linear>
                    </div>

                    <v-divider></v-divider>
                    <v-card-actions class="pa-3">
                      <v-btn @click="submit" :disabled="!valid">update</v-btn>
                      <v-spacer></v-spacer>
                      <v-btn @click="resendEmailVerification">Re-send Email-Verification</v-btn>
                    </v-card-actions>

                    <v-divider></v-divider>
                    <v-card class="mt-2 pa-0" v-if="userData.providerData && userData.providerData.length">
                      <div v-for="(prov, id) in userData.providerData" :key="id">
                        <v-card-text>
                          <span class="blue--text">Authentication Provider:</span> {{ prov.providerId }}
                          <v-spacer></v-spacer>
                          <span class="blue--text">Photo URL:</span> {{ prov.photoURL }}
                        </v-card-text>
                        <v-divider></v-divider>
                      </div>
                    </v-card>

                  </v-form>
                </v-flex>
                <v-flex v-else>no user data</v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
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
        valid: false,
        emailRules: [
          (v) => !!v || 'E-mail is required',
          (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
        ],
        rolesList: [], // list of available roles
        userRoles: [], // roles currently assigned to this user
        initRoles: [], // keep record of the initial state
        addRoles: [],  // which roles are to be added for this user?
        removeRoles: [] // which roles are to be removed from this user?
      }
    },

    computed: {
      profileComplete () {
        let v = 50
        if (this.userData.name) v += 25
        if (this.userData.verified) v += 25
        return v
      },
      ownProfile () {
        return this.$route && this.$route.name === 'profile'
      },
      // get user depending on current route!
      userData () {
        if (this.ownProfile) {
          return this.$store.getters.user
        }
        if (!this.users) return {}
        return this.users[this.$route.params.userId]
      }
    },

    watch: {
      userRoles (newRoles) {
        if (!this.rolesList) return
        // loop through all existing roles
        for (let idx in this.rolesList) {
          let role = this.rolesList[idx]
          let posInInit = this.initRoles.indexOf(role)
          let posInNew = newRoles.indexOf(role)
          let posInRemove = this.removeRoles.indexOf(role)
          let posInAdd = this.addRoles.indexOf(role)
          // Do we have a role to be added?
          if (posInInit < 0 && posInNew > -1) {
            // put it into the ADD list if not there yet
            if (posInAdd < 0) this.addRoles.push(role)
            // make sure the role is not in the REMOVE list
            if (posInRemove > -1) this.removeRoles.splice(posInRemove, 1)
          }
          // Do we have a role to be removed that was there initially?
          if (posInInit > -1 && posInNew < 0) {
            // put it into the REMOVE list if not there yet
            if (posInRemove < 0) this.removeRoles.push(role)
            // remove it from the ADD list if necessary
            if (posInAdd > -1) this.addRoles.splice(posInAdd, 1)
          }
          // Do we have a role to be removed that was NOT there initially?
          // (the user had added it earlier in this session)
          if (posInInit < 0 && posInAdd > -1 && posInNew < 0) {
            // get it OUT OF the REMOVE list if necessary
            if (posInRemove > -1) this.removeRoles.splice(posInRemove, 1)
            // remove it from the ADD list if necessary
            if (posInAdd > -1) this.addRoles.splice(posInAdd, 1)
          }
          // a role was clicked again (the user can't make up this mind...)
          if ((posInInit > -1) && posInNew > -1) {
            // remove it from the ADD list if necessary
            if (posInAdd > -1) this.addRoles.splice(posInAdd, 1)
            // remove it from the REMOVE list if necessary
            if (posInRemove > -1) this.removeRoles.splice(posInRemove, 1)
          }
        }
      },

      $route (value) {
        // when moving from any user's profile to your own, we neet to do:
        this.createRolesArrays()
        // (as 'mounted()' won't trigger!)
      }
    },

    created () {
      this.createRolesArrays()
      this.refreshInitRoles()
    },

    methods: {

      refreshInitRoles () {
        this.initRoles = []
        this.addRoles = []
        this.removeRoles = []
        for (let r in this.userRoles) {
          this.initRoles.push(this.userRoles[r])
        }
      },

      createRolesArrays () {
        // create list of possible roles
        this.rolesList = []
        for (let role in this.roles) {
          this.rolesList.push(role)
        }
        // create list of roles actually assigned to this user
        if (this.userData.roles) {
          this.userRoles = []
          this.userData.roles.forEach(element => {
            this.userRoles.push(element)
          })
        }
      },

      submit () {
        if (this.$refs.form.validate()) {
          this.userData.roles = this.userRoles
          const profileData = {
            id: this.userData.id,
            email: this.userData.email,
            name: this.userData.name,
            roles: this.userRoles
          }
          // update the user profile
          this.$store.dispatch('updateUserProfile', profileData)
          // update the list of roles and their users
          this.$store.dispatch('updateRolesUserList', {
            user: this.userData,
            add: this.addRoles,
            remove: this.removeRoles
          })
          this.refreshInitRoles()
        }
      },
      resendEmailVerification () {
        this.$store.dispatch('sendEmailVerification')
        this.$store.dispatch('setLoading', true)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
