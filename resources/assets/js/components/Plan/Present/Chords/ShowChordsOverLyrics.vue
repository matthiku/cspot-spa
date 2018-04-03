<template>
  <span :id="'item-' + itemId + '-code-' + code">
  </span>  
</template>


<script>
export default {
  props: ['part', 'code', 'itemId'],

  mounted () {
    let elem = document.getElementById('item-seqno-' + this.itemId)
    elem.classList.remove('hidden')

    this.part.lines.forEach(line => {
      // create elements to contain chords and lyrics
      let chLine = document.createElement('DIV')
      let lyLine = document.createElement('DIV')
      chLine.classList.add('chords-line')
      lyLine.classList.add('lyrics-line')
      lyLine.classList.add('mb-2')

      // append those elements to the relevant DOM element
      let ground = document.getElementById('item-' + this.itemId + '-code-' + this.code)
      ground.appendChild(chLine)
      ground.appendChild(lyLine)

      // now add the actual chords and lyrics
      line.items.forEach(el => {
        let ch = document.createElement('DIV')
        ch.style.display = 'inline-block'
        ch.textContent = el.chords
        let ly = document.createElement('DIV')
        ly.style.display = 'inline-block'
        ly.textContent = el.lyrics
        chLine.appendChild(ch)
        lyLine.appendChild(ly)
        let lastChar = el.lyrics.substr(el.lyrics.length - 1)
        let maxWidth = Math.max(ch.offsetWidth, ly.offsetWidth) + (lastChar===' ' ? 6 : 1)
        ch.style.width = maxWidth + 'px'
        ly.style.width = maxWidth + 'px'
      })
    })
    elem.classList.add('hidden')
  }
}
</script>
