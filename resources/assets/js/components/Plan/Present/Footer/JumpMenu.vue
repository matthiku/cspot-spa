<template>
  <v-menu bottom left lazy dark nudge-left="55" origin="bottom center 0" transition="scale-transition">

    <v-btn icon slot="activator" dark
        title="jump to other items menu"
      ><v-icon>more_vert</v-icon>
    </v-btn>

    <v-list dense>
      <template v-for="(item, j) in menuItems">

        <v-list-tile v-if="item.header" :key="j" ripple
            @click="go ( item.action )">
          <v-list-tile-title><v-icon>{{ item.icon }}</v-icon>&nbsp;{{ item.title }}</v-list-tile-title>
        </v-list-tile>

        <v-divider v-else-if="item.divider" :key="j"></v-divider>

        <v-list-tile v-else :key="j" ripple
            :disabled="item.action === currentItemSeqNo"
            @click="go(item.action)"
            :class="item.color + '--text text--' + item.colorVar"
          >
          <v-list-tile-title>
            <v-icon
                :class="item.color + '--text'"
              >{{ item.icon }}
            </v-icon>
            &nbsp;
            {{ item.title }}
          </v-list-tile-title>
        </v-list-tile>

      </template>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  props: ['plan', 'currentItemSeqNo'],

  data () {
    return {
      baseMenuItems: [
        { divider: true },
        { header: true, title: 'Back to Plan (Esc)', action: 'back', icon: 'exit_to_app' }
      ],
      menuItems: []      
    }
  },

  watch: {
    plan () {
      this.createMenu() // re-create the menu when plan is changed
    }
  },

  mounted () {
    this.createMenu() // create the presentation navigation menu
  },

  methods: {
    createMenu () {
      this.menuItems = []
      this.plan.actionList.forEach(item => {
        if (!item.forLeadersEyesOnly)
          this.menuItems.push({ 
            title: `(${item.seqNo}) ${item.title}`,
            action: item.seqNo,
            icon: item.icon,
            color: item.color.substr(0, item.color.indexOf(' ')),
            colorVar: item.color.substr(item.color.indexOf(' ')+1)
          })
      })
      // now add the basic menu items as well (at the end!)
      this.baseMenuItems.forEach(item => this.menuItems.push(item))
    },

    go (where) {
      this.$emit('keyPressed', {code: 'go', where})
    }    
  }
}
</script>

<style>

</style>
