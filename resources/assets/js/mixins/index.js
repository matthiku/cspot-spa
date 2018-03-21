export default {
  computed: {
    user() {
      return this.$store.getters.user
    },
    users() {
      return this.$store.getters.users
    },
    error() {
      return this.$store.getters.error
    },
    message() {
      return this.$store.getters.message
    },
    routeChanging() {
      return this.$store.getters.routeChanging
    },
    dialog() {
      return this.$store.getters.dialog
    },
    dialogShow() {
      return this.$store.getters.dialogShow
    },
    loading() {
      return this.$store.getters.loading
    },
    roles() {
      return this.$store.getters.roles
    },
    rolesByName() {
      return this.$store.getters.rolesByName
    },
    userIsAdmin() {
      return this.$store.getters.userIsAdmin
    },
    search() {
      return this.$store.getters.search
    }
  },

  methods: {
    onDismissed(what) {
      this.$store.dispatch(what)
    },
    toggleAdmin () {
      this.$store.commit('toggleAdmin')
    }
  }
}
