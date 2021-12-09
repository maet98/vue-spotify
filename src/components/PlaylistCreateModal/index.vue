<template>

  <modal v-if="showModal"> 
    <h3 slot="header" class="modal-title" v-if="!evaluation">
      Subir una nueva cancion
    </h3>
    <h3 slot="header" class="modal-title" v-else>
      Evaluacion para la cancion "{{this.selected.name}}"
    </h3>
    
    <div slot="body">
      <form v-if="!evaluation">
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
            <div class="row" >
              <tracks-list v-if="searching" :tracks="getTracks" :selected="selected" :setSelected="setSelected" :showArtists="true" :offset="offset"/>
              <div class="row" v-if="searching">
                <div class="col">
                  <v-button :onClick="previous" >atras</v-button>
                </div>
                <div class="col">
                  <v-button :onClick="next" >
                    proxima
                  </v-button>
                </div>
              </div>
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
              <div class="col text-center" v-if="loadingLyrics">
                <div class="spinner-border text-success" role="status" >
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
              <div class="col" style="overflow:auto; max-height: 600px; max-width: 900px;" v-else>
                <p style="white-space: pre-line"> {{ lyrics}}  </p>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div>
        <img v-for="emotion in this.evaluation" :key="emotion" :src="require('@/assets/'+emotion+'.png')" alt="" width="100px" height="100px" style="margin: 20px">
      </div>
    </div>

    <div slot="footer">
      <div v-if="!evaluation">
        <v-button :onClick="clearForm" :isBlack="true">Cancelar</v-button>
        <v-button :onClick="evaluate" v-if="!evaluating">
          Agregar cancion
        </v-button>
        <v-button :onClick="evaluate" v-else>
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        </v-button>
      </div>
      <v-button :onClick="clearForm" :isBlack="true" v-else>Salir</v-button>
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
        loadingLyrics: false,
        selected: null,
        song: null,
        limit: 5,
        offset: 0,
        evaluating: false,
        searching: false,
        evaluation: null,
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
              .slice(this.offset, this.offset + this.limit)
              .map((key) => ({ ...this.tracks.items[key] }))
          : [];
      }
    },
    mounted() {
      // this.getSongLyrics();
    },
    methods: {
      next() {
        if(this.offset + this.limit < this.tracks.items.length) {
          this.offset += this.limit;
        } else {
          this.offset = this.tracks.items.length - this.limit;
        }

      },
      previous() {
        if(this.offset - this.limit >= 0) {
          this.offset -= this.limit;
        } else {
          this.offset = 0;
        }
      },
      setSelected(value) {
        this.name = "";
        this.searching = false;
        this.selected = value;
        this.findLyrics();
      },
      async findLyrics() {
        this.loadingLyrics = true;
        console.log("findLyrics")
        var artist = "";
        for(let i = 0; i < this.selected.artists.length;i++) {
          artist += this.selected.artists[i].name + " ";
        }
        var ans = await axios.get("http://localhost:8000/song/lyrics/"+artist+"/"+ this.selected.name)
        this.lyrics = ans.data;
        this.loadingLyrics = false;

      },
      ...mapActions({
        search: "search/search"
      }),
      async getSearchTrack() {
        console.log("get search track")
        this.search(this.name)
        this.searching = true;
      },
      clearForm() {
        this.evaluation = null;
        this.selected = null;
        this.lyrics = "";
        this.close()
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

      async evaluate() {
        this.evaluating = true;
        console.log(this.selected)
        const res = await axios.post("http://localhost:8000/song/evaluate", {
          lyrics: this.lyrics,
          song: this.selected
        })
        console.log(res.data)
        this.evaluating = false;
        this.evaluation = res.data;
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
