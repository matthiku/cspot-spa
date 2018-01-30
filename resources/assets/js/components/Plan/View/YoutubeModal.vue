<template>
  <div>

    <v-tooltip bottom>
      <v-btn icon ripple slot="activator" @click="youtubeModal=true">
        <v-icon color="red">subscriptions</v-icon>
      </v-btn>
      <span>play song from youtube</span>
    </v-tooltip>

    <v-dialog lazy v-model="youtubeModal" max-width="420px">
      
      <v-card>

        <v-card-media height="345px">
          <iframe v-if="youtubeModal"
            width="420" height="345" :src="'https://www.youtube.com/embed/' + youtubeId + '?autoplay=1'">
          </iframe>
        </v-card-media>
        
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">Playing Song</h3>
            <div>more details will be provided here eventually.</div>
          </div>
        </v-card-title>
        
        <v-card-actions>
          <a  target="new"
              class="youtube-link"
              @click="youtubeModal=false"
              title="play song clip in new tab"
              :href="'https://www.youtube.com/watch?v=' + youtubeId"
            >
            <v-btn flat color="orange">Play on Youtube</v-btn>
          </a>
          <v-btn color="primary" flat @click.stop="youtubeModal=false">Close</v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>
  </div>  
</template>


<script>
  export default {
    props: ['youtubeId'],

    data () {
      return {
        youtubeModal: false,
        showYoutube: true
      }
    }
  }
</script>


<style>

</style>
