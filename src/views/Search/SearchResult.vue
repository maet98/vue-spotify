<template>
  <div v-scroll>
    <div>
      <template v-if="isTracksExists">
        <entity-header
          @click.native="goTo('search-track')"
          title="Tracks"
          small
        />

        <tracks-list :tracks="getTracks" />
      </template>

    </div>
  </div>
</template>

<script>
  import { mapState } from "vuex";
  import router from "@/router";

  import EntityHeader from "@/components/EntityHeader";
  import MediaObject from "@/components/MediaObject";
  import MediaContainer from "@/components/MediaContainer";
  import TracksList from "@/components/TracksList";

  export default {
    name: "search-result-view",

    components: {
      TracksList,
      MediaObject,
      EntityHeader,
      MediaContainer
    },

    data() {
      return {
        maxResults: 12
      };
    },

    computed: {
      ...mapState("search", [
        "query",
        "result",
        "isLoading",
        "error",
        "albums",
        "tracks",
        "artists",
        "playlists"
      ]),

      isTracksExists() {
        return this.tracks && this.tracks.total > 0;
      },

      isAlbumsExists() {
        return this.albums && this.albums.total > 0;
      },

      isArtistsExists() {
        return this.artists && this.artists.total > 0;
      },

      isPlaylistsExists() {
        return this.playlists && this.playlists.total > 0;
      },

      getTracks() {
        return this.tracks && this.tracks.items
          ? Object.keys(this.tracks.items)
              .slice(0, 5)
              .map((key) => ({ ...this.tracks.items[key] }))
          : [];
      }
    },

    methods: {
      goTo(name) {
        router.push({ name, params: { query: this.query } });
      }
    }
  };
</script>
