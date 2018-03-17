export default {
  state: {
    presentation: {
      versesPerSlide: 5,
      lyricsFont: {
        size: 25,
        bold: false,
        italics: false,
        titleSize: 50,
        titleBold: false,
        titleItalics: false,
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
      state.presentation.lyricsFont.size = payload.lyricsFontSize
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