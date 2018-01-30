<template>
  <v-container>

    <!-- Sign Up Form -->
    <v-layout row wrap>
      <v-flex sm12 md6 offset-sm2>
        <v-card>
          <v-card-text>
            <v-container>

              <form @submit.prevent="onSignUp" @keyup.prevent.enter="onSignIn">

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
                    <v-text-field
                      name="confirmPassword"
                      label="Confirm Password"
                      id="confirmPassword"
                      v-model="confirmPassword"
                      type="password"
                      :rules="[comparePasswords]"
                      ></v-text-field>
                  </v-flex>
                </v-layout>

                <!-- Submit Button -->
                <v-layout row>
                  <v-flex xs12>
                    <v-card-actions>
                      <v-btn 
                        type="submit" 
                        class="primary"
                        :disabled="!formIsValid" 
                        :loading="loading"
                        @click="loader = 'loading'"
                        >Sign Up
                        <span slot="loader" class="custom-loader">
                          <v-icon light>cached</v-icon>
                        </span>
                      </v-btn>
                      <v-spacer></v-spacer>
                      Already have an account?
                      <router-link :to="{ name: 'signin'}">Sign in</router-link>
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
      password: '',
      confirmPassword: ''
    }
  },

  computed: {

    formIsValid () {
      return this.email !== '' &&
        this.password !== '' &&
        this.confirmPassword !== ''
    },

    comparePasswords () {
      return this.password !== this.confirmPassword ? 'Passwords do not match' : ''
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
        this.$router.push('/')
      }
    }
  },

  methods: {

    onSignUp () {
      if (!this.formIsValid) {
        return
      }
      const signupData = {
        email: this.email,
        password: this.password
      }
      this.$store.dispatch('signUserUp', signupData)
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
