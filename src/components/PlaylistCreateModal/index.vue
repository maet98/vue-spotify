<template>

  <modal v-if="showModal"> 
    <h3 slot="header" class="modal-title">
      Subir una nueva cancion
    </h3>
    
    <div slot="body">
      <form>
        <div>
          <label for="name">Nombre de la cacion:</label>
          <div class="container">
            <div class="row">
              <div class="col-10">
                <input id="name" name="name" placeholder="buscar cancion" v-model="name" maxlength="100" @change="getSearchTrack"/>
              </div>
              <div class="col">
                <button @click.prevent="getSearchTrack" class="search"><i class="fas fa-search"></i></button>
              </div>
            </div>
            <div class="row">
              <tracks-list v-if="searching" :tracks="getTracks" :selected="selected" :setSelected="setSelected"/>
            </div>
            <div class="row">
              <div class="col">
                <song-card
                  v-if="selected !== null"
                  :image="selected.album.images[0].url"
                  :title="selected.name"
                  :artists="selected.artists"
                />
              </div>
              <div class="col" style="overflow:auto; height: 600px; width: 900px;">
                <p style="white-space: pre-line"> {{ lyrics}}  </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>

    <div slot="footer">
      <v-button :onClick="close" :isBlack="true">Cancel</v-button>
      <v-button :onClick="create">Create</v-button>
    </div>
  </modal>
</template>

<script>
  import api from "@/api";
  import MediaObject from "@/components/MediaObject";
  import { mapGetters, mapActions, mapState } from "vuex";
  import VButton from "@/components/VButton";
  import Modal from "@/components/Modal";
  import axios from "axios";
  import SongCard from "@/components/SongCard";
  import TracksList from "@/components/TracksList";


  export default {
    name: "playlist-modal",
    props: {
      showModal: Boolean,
      close: Function
    },
    components: {
      VButton,
      TracksList,
      SongCard,
      Modal,
      MediaObject
    },

    data() {
      return {
        modalName: "playlist-create-modal",
        name: "",
        description: "",
        isMore: null,
        selected: null,
        song: null,
        searching: false,
        lyrics: ""
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
    mounted() {
      // this.getSongLyrics();
    },
    methods: {
      setSelected(value) {
        this.name = "";
        this.searching = false;
        this.selected = value;
        this.findLyrics();
      },
      async findLyrics() {
        console.log("findLyrics")
        var artist = "";
        for(let i = 0; i < this.selected.artists.length;i++) {
          artist += this.selected.artists[i].name + " ";
        }
        console.log(artist)
        var ans = await axios.get("http://localhost:8000/song/lyrics/"+artist+"/"+ this.selected.name)
        console.log(ans.data)
        this.lyrics = ans.data;

      },
      ...mapActions({
        search: "search/search"
      }),
      async getSearchTrack() {
        console.log("get search track")
        this.search(this.name)
        this.searching = true;
      },
      async getSongLyrics() {
        const Genius = require("genius-lyrics");
        const Client = new Genius.Client()
        alert("get song lyrics")

        const ans = await Client.songs.search("Ojala llueva cafe")
        const firstSong = ans[0];
        console.log("About the Song:\n", firstSong, "\n");

        // Ok lets get the lyrics
        const lyrics = await firstSong.lyrics();
        alert(lyrics)
        console.log("Lyrics of the Song:\n", lyrics, "\n");
        this.lyrics = lyrics;

        // const client = new Genius.Client
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

<style>
#name {
  color: black;
}

.search {
  color: white;
  padding: 8px;
}
</style>
