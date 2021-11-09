<template>
  <div class="playlist-create-modal" width="500px" height="500px">
    <v-modal :modalName="modalName">
      <template slot="header">
        Register Song
      </template>
      <template slot="body">
        <form>
          <div>
            <label for="name">Name</label>
            <input id="name" name="name" v-model="name" maxlength="100"/>
            <button @click.prevent="getSearchTrack">search</button>
            <tracks-list :tracks="getTracks" />
          </div>
        </form>
      </template>
      <template slot="footer">
        <v-button :onClick="hide" :isBlack="true">Cancel</v-button>
        <v-button :onClick="create">Create</v-button>
      </template>
    </v-modal>
  </div>
</template>

<script>
  import api from "@/api";
  import { mapGetters, mapActions, mapState } from "vuex";
  import VButton from "@/components/VButton";
  import VModal from "@/components/VModal";
  import TracksList from "@/components/TracksList";

  export default {
    name: "playlist-modal",

    components: {
      VButton,
      TracksList,
      VModal
    },

    data() {
      return {
        modalName: "playlist-create-modal",
        name: "",
        description: "",
        isMore: null
      };
    },

    computed: {
      ...mapGetters({
        user: "user/getProfile"
      }),

      ...mapState(
        "search", [
        "query",
        "result",
        "isLoading",
        "error",
        "albums",
        "tracks",
        "artists",
        "playlists"
      ]),

      getTracks() {
        return this.tracks && this.tracks.items
          ? Object.keys(this.tracks.items)
              .slice(0, 5)
              .map((key) => ({ ...this.tracks.items[key] }))
          : [];
      }
    },

    methods: {
      ...mapActions({
        search: "search/search"
      }),
      async getSearchTrack() {
        console.log("get search track")
        this.search(this.name)
      },
      hide() {
        this.$modal.hide(this.modalName);
      },

      clearForm() {
        this.name = "";
        this.description = "";
      },

      validate() {
        let valid = true;

        if (!this.name) {
          this.addNotification({
            type: "error",
            message: "You must give your playlist a name.",
            duration: 3000
          });

          return false;
        }

        return valid;
      },

      async create() {
        if (this.validate()) {
          try {
            const response = await api.spotify.playlists.createPlaylist(
              this.user.id,
              this.name,
              this.description
            );

            this.clearUserPlaylists();
            this.getUserPlaylists();

            this.$router.push({
              name: "playlist",
              params: {
                user_id: this.user.id,
                playlist_id: response.data.id
              }
            });

            this.hide();
            this.clearForm();
          } catch (e) {
            console.log(e);
          }
        }
      }
    }
  };
</script>

<style lang="sass"></style>
