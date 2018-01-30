export default {
  data () {
    return {
      activityColours: {
        song: 'indigo lighten-3',
        read: 'cyan lighten-3',
        text: 'lime darken-2'
      }
    }
  },

  computed: {
    types () {
      return this.$store.getters.types
    },
    songs () {
      return this.$store.getters.songs
    },
    plans () {
      return this.$store.getters.plans
    },
    bibleBooks () {
      return this.$store.state.plan.bibleBooks
    },
    bibleBooksList () {
      return this.$store.getters.bibleBooksList
    }
  },

  methods: {
    userOwnsPlan (plan) {
      if (!plan) return false

      // get plan from store and investigate the roles
      let user = this.$store.getters.user
      let check = false
      for (let rl in plan.staff) {
        let role = plan.staff[rl]
        if (role.userId === user.id) check = true
      }
      // an admin is always owner
      return this.$store.getters.userIsAdmin || check
    },

    findRoleInStaff (requestedRole, staff) {
      if (!staff) return null
      // loop through the staff list (an object) and find the requested role
      let user = { name: 'pending', id: null }
      Object.entries(staff).forEach(
        ([key, role]) => {
          if (role.role === requestedRole) user.id = role.userId
        }
      )
      return (this.users && user.id && this.users[user.id]) ? this.users[user.id] : user
    },

    createStaffList (plan) {
      if (!plan) return
      plan.staffList = []
      this.items = []
      let staff = plan.staff
      if (!staff) return

      for (let key in staff) {
        let item = staff[key]
        if (!this.users || !this.users[item.userId]) continue
        this.items.push({
          id: key,
          icon: this.roles[item.role].icon,
          role: item.role,
          userName: this.users[item.userId].name || this.users[item.userId].email,
          warning: false
        })
      }
      plan.staffList = this.items
    }
  },

  created () {
    // make sure we load this at least once
    if (this.bibleBooks === '') {
      this.$store.dispatch('loadBiblebooks')
    }
  }
}
