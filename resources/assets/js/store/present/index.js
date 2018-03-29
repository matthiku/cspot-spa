export default {
  state: {
    presentation: {
      versesPerSlide: 5,
      selectedTab: '1',
      numberOfSlides: 1,
      blankSlide: true,
      textTitleFont: {
        size: 45,
        bold: 'bold',
        align: 'center',
        italic: 'normal',
        colour: '#ffffff',
      },
      lyricsTitleFont: {
        size: 40,
        bold: 'normal',
        align: 'center',
        italic: 'normal',
        colour: '#ffffff',
      },
      lyricsFont: {
        size: 40,
        bold: 'normal',
        align: 'center',
        italic: 'normal',
        colour: '#ffffff',
        slideBgColour: '#455A64',
      },
      chordsFont: {
        size: 14,
        bold: 'normal',
        align: 'left',
        italic: 'normal',
        colour: '#000',
        slideBgColour: '#e1f5fe',
      },
      scriptureFont: {
        size: 35,
        bold: 'normal',
        align: 'center',
        italic: 'normal',
        colour: '#ffffff',
      },
      showFooter: true,
    },
  },

  // M U T A T I O N S  (commits)
  mutations: {
    setPresentation(state, payload) {
      state.presentation = payload
    },

    setPresentationItem(state, payload) {
      state.presentation[payload.item] = payload.value
      localStorage.setItem(payload.item, payload.value)
    },

    setPresentationFont(state, payload) {
      //TODO: use this format
      // state.presentation[payload.entity + 'Font'][payload.what] = payload.bold
      if (payload.bold)
        state.presentation[payload.entity + 'Font'].bold = payload.bold
      if (payload.align)
        state.presentation[payload.entity + 'Font'].align = payload.align
      if (payload.fontSize)
        state.presentation[payload.entity + 'Font'].size = payload.fontSize
      if (payload.italic)
        state.presentation[payload.entity + 'Font'].italic = payload.italic
      if (payload.colour)
        state.presentation[payload.entity + 'Font'].colour = payload.colour
      if (payload.slideBgColour)
        state.presentation[payload.entity + 'Font'].slideBgColour = payload.slideBgColour

      localStorage.setItem(
        payload.entity + 'Font',
        JSON.stringify(state.presentation[payload.entity + 'Font'])
      )
    },
  },

  // G E T T E R S
  getters: {
    presentation(state) {
      if (localStorage.getItem('versesPerSlide')) {
        state.presentation.versesPerSlide = parseInt(
          localStorage.getItem('versesPerSlide')
        )
      }
      if (localStorage.getItem('blankSlide')) {
        state.presentation.blankSlide =
          localStorage.getItem('blankSlide') === 'true' ? true : false
      }
      if (localStorage.getItem('lyricsFont')) {
        state.presentation.lyricsFont = JSON.parse(
          localStorage.getItem('lyricsFont')
        )
      }
      if (localStorage.getItem('chordsFont')) {
        state.presentation.chordsFont = JSON.parse(
          localStorage.getItem('chordsFont')
        )
      }
      if (localStorage.getItem('lyricsTitleFont')) {
        state.presentation.lyricsTitleFont = JSON.parse(
          localStorage.getItem('lyricsTitleFont')
        )
      }
      if (localStorage.getItem('scriptureFont')) {
        state.presentation.scriptureFont = JSON.parse(
          localStorage.getItem('scriptureFont')
        )
      }
      return state.presentation
    },
  },
}
