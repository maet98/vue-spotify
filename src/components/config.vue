<template>

  <modal v-if="showModal"> 
    <h3 slot="header" class="modal-title">
        Configuración
    </h3>
    
    <div slot="body">
      <form>
        <label for="name">Cantidad de canciones por playlist: </label>
        <input id="name" name="name" type="number" placeholder="20" v-model="ammountOfSong" maxlength="100"/>
      </form>
    </div>

    <div slot="footer">
      <v-button :onClick="close" :isBlack="true">Cancelar</v-button>
      <v-button :onClick="save" :isBlack="true">Guardar</v-button>
    </div>
  </modal>
</template>

<script>
  import VButton from "@/components/VButton";
  import Modal from "@/components/Modal";
  import { mapGetters, mapActions } from "vuex";
  import axios from "axios";


  export default {
    name: "playlist-modal",
    props: {
      showModal: Boolean,
      close: Function
    },
    components: {
      VButton,
      Modal,
    },

    data() {
      return {
          ammountOfSong: 20
      };
    },

    methods: {
      ...mapActions({
        setSongPlaylist: "app/setSongPlaylist",
      }),
        save() {
          this.setSongPlaylist(this.ammountOfSong);
            this.close();
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
