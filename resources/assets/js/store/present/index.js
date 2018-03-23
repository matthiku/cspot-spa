export default {
  state: {
    presentation: {
      versesPerSlide: 5,
      selectedTab: null,
      lyricsFont: {
        size: 40,
        bold: 'normal',
        colour: '#ffffff',
        italic: 'normal',
        titleSize: 60,
        titleBold: 'normal',
        titleColour: '#ffffff',
        titleItalic: 'italic',
      },
      scriptureFont: {
        size: 35,
        bold: 'normal',
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

    setLyricsFont (state, payload) {
      if (payload.lyricsBold)
        state.presentation.lyricsFont.bold = payload.lyricsBold
      if (payload.lyricsFontSize)
        state.presentation.lyricsFont.size = payload.lyricsFontSize
      if (payload.lyricsItalic)
        state.presentation.lyricsFont.italic = payload.lyricsItalic
      if (payload.lyricsColour)
        state.presentation.lyricsFont.colour = payload.lyricsColour
      if (payload.lyricsTitleBold)
        state.presentation.lyricsFont.titleBold = payload.lyricsTitleBold
      if (payload.lyricsTitleItalic)
        state.presentation.lyricsFont.titleItalic = payload.lyricsTitleItalic
      if (payload.lyricsTitleColour)
        state.presentation.lyricsFont.titleColour = payload.lyricsTitleColour
      if (payload.lyricsTitleFontSize)
        state.presentation.lyricsFont.titleSize = payload.lyricsTitleFontSize
      localStorage.setItem('lyricsFont', JSON.stringify(state.presentation.lyricsFont))
    },

    setScriptureFont (state, payload) {
      if (payload.scriptureBold)
        state.presentation.scriptureFont.bold = payload.scriptureBold
      if (payload.scriptureFontSize)
        state.presentation.scriptureFont.size = payload.scriptureFontSize
      if (payload.scriptureItalic)
        state.presentation.scriptureFont.italic = payload.scriptureItalic
      if (payload.scriptureColour)
        state.presentation.scriptureFont.colour = payload.scriptureColour
      localStorage.setItem('scriptureFont', JSON.stringify(state.presentation.scriptureFont))
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
      if (localStorage.getItem('scriptureFont')) {
        state.presentation.scriptureFont = JSON.parse(localStorage.getItem('scriptureFont'))
      }
      return state.presentation
    }
  }

}