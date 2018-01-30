<template>
  <div>
    <v-edit-dialog lazy :large="type === 'select'"
        :title="'edit `' + (fieldName || field) + '`'">
      <span v-if="label" class="no-wrap minw-110 text-xs-right">{{ fieldName }}:&nbsp;</span>
      <span
        v-if="song[field]"
        :class="[label ? 'no-wrap' : '']"
        class="blue-grey lighten-3 btn--round px-1">
        {{ song[field] }}</span>
      <span 
        v-else
        :class="[label ? 'blue-grey' : 'grey']"
        class="no-wrap lighten-3 btn--round px-2" 
        :title="'add ' + (fieldName || field)"
        >+</span>

      <v-text-field v-if="type === 'text-input'"
        slot="input"
        :label="'Edit ' + (fieldName || field)"
        hint="Press Enter or Esc to close. Ctrl+z to undo changes."
        v-model="song[field]"
        :rules="[rules.maxChars, rules.required]"
        :required="required ? true : false"
        :clearable="clearable"
        single-line
        counter autofocus
        @keyup.ctrl.enter="updateSong(song.id, field)"
        @keyup.enter="updateSong(song.id, field)"
        @blur="resetField()"
      ></v-text-field>

      <v-select v-else
          slot="input"
          min-width="150px"
          v-bind:items="selectItems"
          v-model="song[field]"
          :label="'Select ' + (fieldName || field)"
          class="input-group--focused"
          item-value="text"
          @click="updateSong(song.id, field)"
          @blur="updateSong(song.id, field)"
        ></v-select>

    </v-edit-dialog>
  </div>
</template>

<script>
  export default {
    props: ['field', 'song', 'maxLength', 'fieldName', 'required', 'selectItems', 'showLabel'],

    data () {
      return {
        fullWidth: false,
        clearable: true,
        type: 'text-input',
        label: false,
        initialValue: '',
        rules: {
          maxChars: (v) => {
            if (this.maxLength < 0) return true
            if (!v) return true
            if (v.length > this.maxLength) return 'Input too long!'
            return true
          },
          required: (v) => {
            if (this.required && !v) return 'This field cannot be empty!'
            return true
          }
        }
      }
    },

    methods: {
      updateSong (id, field) {
        // console.log(this.song[this.field])
        // check if there even were any changes
        if (this.song[this.field] === undefined) this.song[this.field] = ''
        if (this.initialValue.trim() === this.song[this.field].trim()) return

        // don't submit empty strings for required fields
        if (this.required && !this.song[field]) {
          this.song[this.field] = this.initialValue
          return
        }

        let value = this.song[this.field] || ''
        // for firebase, we use the 'key' as identifier (for mySQL, it would be 'id')
        this.$store.dispatch('updateSong', {id: this.song.key, field, value})
        this.initialValue = this.song[this.field]
      },
      resetField () {
        this.song[this.field] = this.initialValue
      }
    },

    created () {
      // save the initial value in order to compare before actually updating
      this.initialValue = this.song[this.field] || ''

      if (this.showLabel !== undefined) this.label = true

      // change input type to select if select items are provided in the props
      if (this.selectItems) {
        this.type = 'select'
      }
    }
  }
</script>

<style scoped>
  .minw-110 {
    min-width: 110px;
  }
</style>
