export default {
  state: {
    presentation: {
      versesPerSlide: 5,
      lyricsFont: {
        size: 35,
        bold: 'bold',
        italics: 'italics',
        titleSize: 50,
        titleBold: 'bold',
        titleItalics: 'italics',
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
      if (payload.lyricsItalics)
        state.presentation.lyricsFont.italics = payload.lyricsItalics
      if (payload.lyricsTitleItalics)
        state.presentation.lyricsFont.titleItalics = payload.lyricsTitleItalics
      localStorage.setItem('lyricsFont', JSON.stringify(state.presentation.lyricsFont))
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
      return state.presentation
    }
  }

}