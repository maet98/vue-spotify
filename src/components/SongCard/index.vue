<template>
    <div class="card" style="width: 14rem;">
        <img :src="image" class="card-img-top" >
        <div class="card-body">
            <h5 class="card-title">{{title}}</h5>
          <p class="card-text"
            v-for="(artist, index) in artists"
            :key="artist.id"
          >
            {{ artist.name }}
            <template v-if="index !== artists.length - 1">
              ,&nbsp;
            </template>
          </p>
        </div>
    </div>
</template>


<script>

  export default {
    name: "navbar",
    props: {
        title: String,
        image: String,
        artists: String
    }
  };
</script>

<style scoped>
.card-img-top {
    border-style: solid;
}
.card-text {
    color: grey;
}

.card {
  background: #1d1f20;
}
</style>