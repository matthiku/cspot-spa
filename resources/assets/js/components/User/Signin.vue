<template>
  <v-container>

    <!-- Sign In Form -->
    <v-layout row wrap>
      <v-flex sm12 md6 offset-sm2>
        <v-card>
          <v-card-text>
            <v-container>

              <form @submit.prevent="onSignIn" @keyup.prevent.enter="onSignIn">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      name="email"
                      label="E-Mail"
                      id="email"
                      v-model="email"
                      type="email"
                      required></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      name="password"
                      label="Password"
                      id="password"
                      v-model="password"
                      type="password"
                      required></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex xs12>
                    <v-card-actions>
                      <v-btn 
                        type="submit" 
                        class="primary"
                        :disabled="!formIsValid" 
                        :loading="loading"
                        @click="loader = 'loading'"
                        >Sign In
                        <span slot="loader" class="custom-loader">
                          <v-icon light>cached</v-icon>
                        </span>
                      </v-btn>                      
                    </v-card-actions>
                  </v-flex>
                </v-layout>
              </form>

            </v-container>
          </v-card-text>

          <v-card-text>
              <v-divider></v-divider>
              or sign in via 
              <v-btn @click="providerSignup('google')">
                Google
              </v-btn>
          </v-card-text>

          <v-card-text>
              <v-divider></v-divider>
              Don't have an account? 
              <router-link :to="{ name: 'signup'}">Create your account</router-link>- it takes less than a minute
          </v-card-text>

        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>



<script>

export default {

  data () {
    return {
      email: '',
      password: ''
    }
  },

  computed: {
    formIsValid () {
      return this.email !== '' &&
        this.password !== ''
    },
    user () {
      return this.$store.getters.user
    },
    error () {
      return this.$store.getters.error
    },
    loading () {
      return this.$store.getters.loading
    }
  },

  watch: {
    // after dispatching the signup, just wait for the user object to change
    // before we navigate to the main app
    user (value) {
      if (value !== null && value !== undefined) {
        if (this.$store.getters.oldRoute) {
          this.$router.push({
            name: this.$store.getters.oldRoute.name,
            params: this.$store.getters.oldRoute.params })
          this.$store.dispatch('setOldRoute', false)
        } else {
          this.$router.push('/')
        }
      }
    }
  },

  methods: {
    onSignIn () {
      if (!this.formIsValid) {
        return
      }
      const signInData = {
        email: this.email,
        password: this.password
      }
      this.$store.dispatch('signUserIn', signInData)
    },
    onDismissed () {
      this.$store.dispatch('clearError')
    },
    providerSignup (provider) {
      this.$store.dispatch('singinViaProvider', provider)
    }
  }
}

</script>
