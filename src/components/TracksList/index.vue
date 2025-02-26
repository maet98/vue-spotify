<template>
  <div v-if="tracks" class="tracks-list">
    <div
      v-for="(item, index) in tracks"
      :key="index"
      class="tracks-list__row"
      :class="isActiveTrack(item)"
      @click="setSelected(item)"
    >
      <div class="tracks-list__cell" v-if="item.album">
        <img
          class="tracks-list__img"
          :src="item.album.images[2].url"
          :alt="item.album.name"
        />
      </div>

      <div class="tracks-list__cell tracks-list__cell--index">
        <span class="tracks-list__cell-index">{{ offset + index + 1 }}</span>
        <track-playback
          :trackUri="item.uri"
          :tracksUris="tracksUris"
          :contextUri="contextUri"
          :offset="index"
        />
      </div>

      <div class="tracks-list__cell">
        <track-addition
          :trackID="item.id"
          :isSaved="savedTracks[index]"
          v-on:updateTrackstatus="onTrackUpdate"
        />
      </div>

      <div class="tracks-list__cell tracks-list__cell--name">
        {{ item.name }}
        <span v-if="item.artists && showArtists">
          &nbsp;-&nbsp;
          <router-link
            class="tracks-list__link"
            v-for="(artist, index) in item.artists"
            :key="artist.id"
            :to="{ name: 'artist', params: { id: artist.id } }"
          >
            {{ artist.name }}
            <template v-if="index !== item.artists.length - 1">
              ,&nbsp;
            </template>
          </router-link>
        </span>
      </div>

      <div
        v-if="item.explicit"
        class="tracks-list__cell tracks-list__cell--explicit"
      >
        <span class="tracks-list__explicit-label">Explicit</span>
      </div>

      <div class="tracks-list__cell tracks-list__cell--duration">
        {{ item.duration_ms | msToMinutes }}
      </div>
    </div>
  </div>
</template>

<script>
  import api from "@/api";
  import { mapGetters } from "vuex";
  import TrackAddition from "@/components/TrackAddition";
  import TrackPlayback from "@/components/TrackPlayback";

  export default {
    name: "tracks-list",

    components: {
      TrackAddition,
      TrackPlayback
    },

    props: {
      tracks: {
        type: Array,
        required: true
      },
      showArtists: {
        type: Boolean,
        default: false
      },
      contextUri: {
        type: String,
        required: false
      },
      offset: Number,
      selected: Object,
      setSelected: Function
    },

    data() {
      return {
        tracksIds: "",
        savedTracks: []
      };
    },

    computed: {
      ...mapGetters("player", {
        playback: "getPlayback",
        context: "getPlaybackContext"
      }),

      tracksUris() {
        return this.tracks ? this.tracks.map((el) => el.uri) : [];
      }
    },

    methods: {
      fetchTrackIds() {
        if (this.tracks) {
          this.tracksIds = this.tracks.map((el) => {
            return el.id;
          });
        }
      },
      setSelectedSong(song) {
        this.setSelected(song);
      },

      async checkSavedTracks() {
        try {
          const saved = {
            offset: 0,
            limit: 50,
            total: this.tracks.length || 0,
            items: []
          };

          while (saved.total > saved.offset) {
            const response = await api.spotify.library.checkUserSavedTracks(
              this.tracksIds
                .slice(saved.offset, saved.offset + saved.limit)
                .toString()
            );
            saved.offset = saved.offset + saved.limit;
            saved.items.push(...response.data);
          }

          this.savedTracks = saved.items;
        } catch (e) {
          console.log(e);
        }
      },

      isActiveTrack(current) {
        const isActiveTrack =
          this.playback.item && this.playback.item.id === current.id;

        return {
          "tracks-list__row--active": isActiveTrack,
          "tracks-list__row--paused":
            isActiveTrack && this.context && this.context.paused
        };
      },

      onTrackUpdate() {
        this.checkSavedTracks();
      }
    },

    watch: {
      tracks() {
        this.fetchTrackIds();
        this.checkSavedTracks();
      }
    }
  };
</script>

<style lang="sass">
  .tracks-list
    padding: 0 15px

    &__link
      color: $c-gray

      &:hover
        color: $c-white
        text-decoration: underline

    &__row
      position: relative
      display: flex
      min-height: 40px
      color: $c-white
      font-size: 13px
      line-height: 15px
      border-bottom: 1px solid $c-mine-shaft

      &:first-of-type
        border-top: 1px solid $c-mine-shaft

      &:hover
        &:not(.tracks-list__row--active)
          background: $c-mine-shaft
          color: $c-white

        .track-addition__button
          color: $c-white

        .track-playback
          display: block

        .tracks-list__cell-index
          display: none

      &--active
        background: $c-mine-shaft
        color: $c-green

        .tracks-list__cell-index
          display: none

        .track-playback
          display: block !important

    &__cell
      display: flex
      align-items: center

      &:not(:first-of-type)
        margin: 0 8px

      &--index
        margin: 0 5px
        min-width: 35px

      &--playback
        width: 40px

      &--name
        width: 100%

    &__img
      width: 40px
      height: 40px

    &__explicit-label
      padding: 3px
      border: 1px solid $c-gray
      border-radius: 3px
      color: $c-gray
      font-size: 9px
      line-height: 1
      letter-spacing: 1.5px
      text-transform: uppercase

    .track-playback
      display: none
</style>
