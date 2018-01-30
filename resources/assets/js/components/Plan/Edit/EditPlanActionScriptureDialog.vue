<template>
  <v-layout row justify-center>
    <v-dialog v-model="scriptureDialog" max-width="700">
      <v-card>
        <v-card-title class="headline">
          Select a Scripture Reference: &nbsp;
          <span v-if="scriptureRef" color="blue darken-2">{{ scriptureRef }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs8 sm6 md4>
                <v-select label="Book" ref="book"
                    v-model="book" 
                    :items="bibleBooksList" 
                    hint="Select the book"
                    autofocus
                    autocomplete
                    required
                    dense
                  ></v-select>
              </v-flex>

              <v-flex xs4 sm3 md2>
                <v-select label="Chapter" ref="chapter"
                    v-model="chapter"
                    :disabled="!book"
                    :items="dialogValues.chapters"
                    autocomplete
                    hint="Select the chapter"
                    required></v-select>
              </v-flex>

              <v-flex xs6 sm3 md2>
                <v-select label="Verse from" ref="verse_from"
                    v-model="verse_from"
                    :disabled="!chapter"
                    :items="dialogValues.verses"
                    autocomplete
                    hint="Select the Start Verse"></v-select>
              </v-flex>

              <v-flex xs6 sm4 md2>
                <v-select label="Verse to" ref="verse_to"
                    v-model="verse_to"
                    :disabled="!chapter"
                    :items="dialogValues.verses_to"
                    autocomplete
                    hint="Select the End Verse"></v-select>
              </v-flex>

              <v-flex xs6 sm4 md2>
                <v-select label="Version" ref="version"
                    v-model="version"
                    :disabled="!chapter"
                    :items="dialogValues.versions"
                    autocomplete
                    @keyup.enter="submit"
                    hint="Select the Bible Version"></v-select>
              </v-flex>

            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="yellow darken-3" flat="flat" @click.native="cancel">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" flat="flat" :disabled="!book" @click.native="book = ''">Reset</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" :disabled="!version" @click.native="submit">Set</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>  
</template>

<script>
import genericMixins from '../../../mixins'
import planMixins from '../mixins'

export default {
  mixins: [genericMixins, planMixins],

  data () {
    return {
      scriptureDialog: false,
      focus: false,
      book: '',
      chapter: 0,
      verse_from: 0,
      verse_to: '',
      version: '',
      dialogValues: {
        versions: ['ESV', 'NIV'],
        chapters: [],
        verses: [],
        verses_to: []
      },
      scriptureRef: ''
    }
  },

  computed: {
    selectedBook () {
      if (this.book) {
        let bk = this.bibleBooks[this.book]
        bk.name = this.book
        return bk
      }
    }
  },

  watch: {
    version (val) {
      if (val) {
        let vto = this.verse_to || this.selectedBook.chapters[this.chapter]
        this.genScriptRef(vto)
      }
    },
    verse_to (val) {
      this.genScriptRef(val)
      if (!this.version) {
        this.$nextTick(() => this.$refs.version.focus())
      }
    },
    verse_from (val) {
      if (val) {
        let vto = this.verse_to || this.selectedBook.chapters[this.chapter]
        this.genScriptRef(vto)
        this.dialogValues.verses_to = this.createNumArray(val, vto)
        this.$nextTick(() => this.$refs.verse_to.focus())
      }
    },
    chapter (val) {
      if (val) {
        let vto = this.selectedBook.chapters[this.chapter]
        this.scriptureRef += ' ' + val + ':1-' + vto
        this.dialogValues.verses = this.createNumArray(1, vto)
        this.$nextTick(() => this.$refs.verse_from.focus())
      } else {
        this.dialogValues.verses = []
        this.verse_from = 0
        this.verse_to = ''
        this.version = ''
      }
    },
    book (val) {
      if (val) {
        this.scriptureRef = val
        // create an array with chapter numbers
        let ch = this.bibleBooks[val].chapters
        this.dialogValues.chapters = this.createNumArray(1, Object.keys(ch).length)
        this.chapter = 0
        this.verse_from = 0
        this.verse_to = ''
        this.$nextTick(() => this.$refs.chapter.focus())
      } else {
        this.$nextTick(() => this.$refs.book.focus())
        this.scriptureRef = ''
        this.chapter = 0
      }
    },
    dialogShow () {
      if (this.dialog.field === 'scriptureDlg') {
        this.book = ''
        this.scriptureDialog = true
        this.$store.dispatch('setDialog', {field: ''})
      }
    }
  },

  methods: {
    cancel () {
      this.scriptureDialog = false
      this.$store.dispatch('hideDialog')
    },
    submit () {
      this.$store.dispatch('setDialog', {
        value: this.scriptureRef,
        field: 'scriptureRef'
      })
      this.scriptureDialog = false
      this.$store.dispatch('hideDialog')
    },
    resetItem () {
      this.$nextTick(() => this.$refs.book.focus())
      this.$refs.book.focus()
      this.book = ''
    },
    genScriptRef (vto) {
      this.scriptureRef = `${this.book} ${this.chapter}:${this.verse_from || '1'}-${this.verse_to || vto} (${this.version || '?'})`
    },
    createNumArray (start, end) {
      let ar = []
      for (start; start <= end; start++) {
        ar.push(start)
      }
      return ar
    }
  }
}
</script>
