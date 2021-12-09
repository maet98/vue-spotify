<template>
  <div class="browse-view">

    <div class="container-fluid">
      <div class="row">
        <div class="col p-2" v-for="emotion in emotions" :key="emotion.name">
          <router-link :to="{ name: 'playlist', params: { playlist_id: emotion.id } }">
            <img
              class="genres-view__category-img"
              :src="require('@/assets/'+ emotion.img)"
              :alt="emotion.name"
              style="width: 250px"
            />
          </router-link>

        </div>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    name: "browse-view",
    data() {
      return {
        emotions: [
          {
            img: "happy.png",
            name: "Felicidad",
            id: "happy"
          },
          {
            img: "sad.png",
            name: "Tristeza",
            id: "sad"
          },
          {
            img: "angry.png",
            name: "Ira",
            id: "angry"
          },
          {
            img: "calm.png",
            name: "Calma",
            id: "calm"
          }
        ]
      }
    }
  };
</script>

<style scoped lang="sass">

  .browse-view
    padding: 8px

    &__nav
      display: flex
      padding: 15px 0
      justify-content: center

    &__nav-item
      position: relative
      margin: 0 15px
      color: $c-gray
      font-size: 17px
      text-transform: uppercase
      cursor: pointer

      &:hover
        color: $c-white

      &--active
        color: $c-white

        &:after
          +horizontal-center
          bottom: -10px
          width: 50px
          height: 3px
          background: $c-green
          content: ''

    &__content
      padding: 15px 0

  .genres-view
    height: calc(100vh - 227px)

    &__inner
      padding: 0 15px 0 8px

    &__category
      position: relative
      display: inline-block
      width: 50%
      padding: 7px
      vertical-align: top

    &__category-img
      width: 100%

    &__category-name
      position: absolute
      top: 70%
      left: 0
      right: 0
      padding: 0 15px
      color: $c-white
      font-size: 16px
      text-align: center

      &:hover
        text-decoration: underline

  +breakpoint(medium)
    .genres-view
      &__category
        width: 33%

  +breakpoint(large)
    .genres-view
      &__category
        width: 25%

  +breakpoint(xlarge)
    .genres-view
      &__category
        width: 16.66%

</style>
