<template>
  <div v-if="!!tracks.length" class="tracks-table">
    <div class="tracks-table__row tracks-table__row--header">
      <div class="tracks-table__cell tracks-table__cell--playback"></div>

      <div class="tracks-table__cell tracks-table__cell--name">
        Title
      </div>

      <div class="tracks-table__cell tracks-table__cell--artist">
        Artist
      </div>

      <div class="tracks-table__cell tracks-table__cell--album">
        Album
      </div>

      <div class="tracks-table__cell tracks-table__cell--added-at">
        <icon name="calendar-alt" />
      </div>

      <div class="tracks-table__cell tracks-table__cell--duration">
        <icon name="clock" />
      </div>
    </div>

    <div
      class="tracks-table__row"
      v-for="(item, index) in tracks"
      :key="index"
      :class="isActiveTrack(item)"
      :data-id="item.id"
    >
      <div class="tracks-table__cell tracks-table__cell--playback">
        <track-playback
          :trackUri="item.uri"
          :tracksUris="tracksUris"
          :offset="index"
        />
      </div>

      <div class="tracks-table__cell">
        {{ item.name }}
        <span v-if="item.explicit" class="tracks-table__explicit-label">
          Explicit
        </span>
      </div>

      <div class="tracks-table__cell">
        <div>
          <router-link
            class="tracks-table__link"
            v-for="(artist, index) in item.artists"
            :key="index"
            :to="{ name: 'artist', params: { id: artist.id } }"
          >
            {{ artist.name }}
            <template v-if="index !== item.artists.length - 1">
              ,&nbsp;
            </template>
          </router-link>
        </div>
      </div>

      <div class="tracks-table__cell">
        <router-link
          class="tracks-table__link"
          :to="{ name: 'album', params: { id: item.album.id } }"
        >
          {{ item.album.name }}
        </router-link>
      </div>

      <div class="tracks-table__cell tracks-table__cell--added-at">
        <div v-if="ratedSong[$route.params.playlist_id][item.id] == undefined">
          <i class="far fa-thumbs-up mr-2" style="margin-right: 20px;" @click="handleLike(true, index)"></i>
          <i class="far fa-thumbs-down" @click="handleLike(false, index)"></i>
        </div>
        <div v-else-if="ratedSong[$route.params.playlist_id][item.id]">
          <i class="fas fa-thumbs-up mr-2" style="margin-right: 20px;" @click="handleLike(true, index)"></i>
        </div>
        <div v-else>
          <i class="fas fa-thumbs-down mr-2" style="margin-right: 20px;" @click="handleLike(false, index)"></i>
        </div>
      </div>

      <div class="tracks-table__cell tracks-table__cell--duration">
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
  import Axios from 'axios';

  export default {
    name: "tracks-table",

    components: {
      TrackAddition,
      TrackPlayback
    },

    props: {
      tracks: {
        required: true,
        default: []
      },
      type: {
        type: String,
        required: false
      },
      contextUri: {
        required: false
      }
    },

    data() {
      return {
        savedTracks: [],
        ratedSong: [],
        update: false
      };
    },

    computed: {
      ...mapGetters({
        user: "user/getProfile",
        playback: "player/getPlayback",
        context: "player/getPlaybackContext"
      }),
      tracksUris() {
        return this.tracks.map((el) => {
          return el.uri;
        });
      },

      tracksIds() {
        return this.tracks.map((el) => {
          return el.id;
        });
      },
    },
    mounted() {
      this.getRatedSong();
    },

    methods: {
      handleLike(value, id) {
        const {playlist_id } = this.$route.params;
        const song_id = this.tracks[id].id
        if(this.ratedSong[playlist_id][song_id] == undefined) {
          this.ratedSong[playlist_id][song_id] = value
          const body = {
            id: song_id,
            emotion: playlist_id,
            user: this.user.id,
            good: value
          }
          Axios.post("http://localhost:8000/song/rating", body)
        } else {
          this.ratedSong[playlist_id][song_id] = undefined
        }
        this.$forceUpdate()
      },
      async getRatedSong() {
        const res = await Axios.get("http://localhost:8000/song/rating/"+this.user.id)
        console.log(res.data)
        this.ratedSong = res.data;
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
          "tracks-table__row--active": isActiveTrack,
          "tracks-table__row--paused":
            isActiveTrack && this.context && this.context.paused
        };
      },


    },

    watch: {
      tracks() {
        this.checkSavedTracks();
      }
    }
  };
</script>

<style lang="sass">

  .tracks-table
    display: flex
    flex-flow: column
    padding: 0 15px 20px

    &__link
      color: $c-white

      &:hover
        text-decoration: underline

    &__row
      position: relative
      display: flex
      min-height: 40px
      padding: 5px
      color: $c-white
      font-size: 13px
      line-height: 15px
      border-bottom: 1px solid $c-mine-shaft

      &:hover
        &:not(:first-of-type)
          background: $c-mine-shaft
          color: $c-white

        .tracks-table__explicit-label
          color: $c-white
          border-color: $c-white

        .track-addition__button
          color: $c-white

        .track-playback
          display: block

      &--header
        color: $c-gray
        text-transform: uppercase

      &--active
        background: $c-mine-shaft
        color: $c-green

        .tracks-table__link
          color: $c-green

        .track-playback
          display: block !important

    &__cell
      display: flex
      flex: 1
      align-items: center
      position: relative
      margin-right: 10px

      &--playback
        max-width: 40px

      &--addition
        max-width: 40px

      &--added-at
        max-width: 100px

      &--duration
        max-width: 60px

    &__explicit-label
      float: right
      margin-left: 5px
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
