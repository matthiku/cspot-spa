<template>
  <span>

      <h3>{{ item.title }}</h3>

      <pre v-if="!item.onsongs">{{ item.lyrics }}</pre>

      <div v-else v-for="parts in item.onsongs" :key="parts.id">
        <pre>{{ parts.text }}</pre>
        <hr>
      </div>

  </span>  
</template>


<script>
export default {
  name: 'PresentLyrics',

  props: ['item'],

  created () {
  }
}
</script>
