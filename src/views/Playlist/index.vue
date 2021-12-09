<template>
  <div class="playlist-view" v-scroll @vScroll="loadMore">
    <div class="playlist-view__content">
      <img class="m-4" :src="require('@/assets/' + playlistID + '.png')" width="200" >
      <div class="text-center">
        <tracks-table :tracks="tracks" :contextUri="playlist.uri" v-if="!loadingPlaylist"/>
        <div class="spinner-border text-success text-center" role="status" v-else>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from "@/api";
  import { mapGetters, mapActions } from "vuex";
  import EntityInfo from "@/components/EntityInfo";
  import TracksTable from "@/components/TracksTable";
  import Axios from 'axios';

  export default {
    name: "playlist-view",

    components: {
      EntityInfo,
      TracksTable
    },

    data() {
      return {
        userID: null,
        playlistID: null,
        playlist: {},
        loadingPlaylist: false,
        tracks: null,
        more: null
      };
    },

    computed: {
      ...mapGetters({
        playlist: "playlist/getPlaylist",
        playlistPerSong: "app/songPerPlaylist"
      })
    },

    methods: {
      ...mapActions({
        notFoundPage: "app/notFoundPage",
        fetchPlaylist: "playlist/fetchPlaylist"
      }),

      initData() {
        this.tracks = {
          limit: 50,
          offset: 0,
          total: 1,
          items: []
        };
      },

      async getPlaylistTracksv2() {
        this.loadingPlaylist = true;
        const res = await Axios.get("http://localhost:8000/song/playlists/"+this.playlistID+"?limit="+this.playlistPerSong)
        this.tracks = res.data;
        this.loadingPlaylist = false;
      },

      async loadMore(ev) {
        if (this.more) {
          return false;
        }

        if (ev.detail.scrollbarV.percent > 70) {
          this.more = true;
          this.getPlaylistTracks(this.userID, this.playlistID);
        }
      },

      init() {
        const {  playlist_id } = this.$route.params;

        this.playlistID = playlist_id;
        this.playlist = {
          type: "playlist",
          uri: "",
          name: playlist_id,
          img: "@/assets/" + playlist_id + ".png",
          owner: ""
        }
        // this.initData();
        this.getPlaylistTracksv2();
      }
    },

    watch: {
      $route() {
        this.init();
      }
    },

    created() {
      this.init();
    }
  };
</script>

<style scoped lang="sass"></style>
