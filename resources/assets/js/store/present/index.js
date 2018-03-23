export default {
  state: {
    presentation: {
      versesPerSlide: 5,
      selectedTab: null,
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
      },
      scriptureFont: {
        size: 35,
        bold: 'normal',
        align: 'center',
        italic: 'normal',
        colour: '#ffffff'
      },
      showFooter: true
    }
  },

  // M U T A T I O N S  (commits)
  mutations: {

    setPresentation (state, payload) {
      state.presentation = payload
    },

    setPresentationSlide (state, payload) {
      state.presentation.showSeqNo = payload.showSeqNo
    },

    setVersesPerSlide (state, payload) {
      state.presentation.versesPerSlide = payload
      localStorage.setItem('versesPerSlide', payload)
    },

    setPresentationFont (state, payload) {
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

      localStorage.setItem(payload.entity + 'Font', JSON.stringify(state.presentation.scriptureFont))
    }
  },

  // G E T T E R S
  getters: {

    presentation (state) {
      if (localStorage.getItem('versesPerSlide')) {
        state.presentation.versesPerSlide = localStorage.getItem('versesPerSlide')
      }
      if (localStorage.getItem('lyricsFont')) {
        state.presentation.lyricsFont = JSON.parse(localStorage.getItem('lyricsFont'))
      }
      if (localStorage.getItem('lyricsTitleFont')) {
        state.presentation.lyricsTitleFont = JSON.parse(localStorage.getItem('lyricsTitleFont'))
      }
      if (localStorage.getItem('scriptureFont')) {
        state.presentation.scriptureFont = JSON.parse(localStorage.getItem('scriptureFont'))
      }
      return state.presentation
    }
  }

}