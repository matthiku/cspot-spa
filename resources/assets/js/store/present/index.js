export default {
  state: {
    presentation: {
      versesPerSlide: 5,
      lyricsFont: {
        size: 40,
        bold: 'normal',
        italic: 'normal',
        titleSize: 60,
        titleBold: 'normal',
        titleItalic: 'italic'
      },
      scriptureFont: {
        size: 35,
        bold: 'normal',
        italic: 'normal'
      }
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

    setLyricsFont (state, payload) {
      if (payload.lyricsFontSize)
        state.presentation.lyricsFont.size = payload.lyricsFontSize
      if (payload.lyricsTitleFontSize)
        state.presentation.lyricsFont.titleSize = payload.lyricsTitleFontSize
      if (payload.lyricsBold)
        state.presentation.lyricsFont.bold = payload.lyricsBold
      if (payload.lyricsTitleBold)
        state.presentation.lyricsFont.titleBold = payload.lyricsTitleBold
      if (payload.lyricsItalic)
        state.presentation.lyricsFont.italic = payload.lyricsItalic
      if (payload.lyricsTitleItalic)
        state.presentation.lyricsFont.titleItalic = payload.lyricsTitleItalic
      localStorage.setItem('lyricsFont', JSON.stringify(state.presentation.lyricsFont))
    },

    setScriptureFont (state, payload) {
      if (payload.scriptureFontSize)
        state.presentation.scriptureFont.size = payload.scriptureFontSize
      if (payload.scriptureBold)
        state.presentation.scriptureFont.bold = payload.scriptureBold
      if (payload.scriptureItalic)
        state.presentation.scriptureFont.italic = payload.scriptureItalic
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