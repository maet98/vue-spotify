<template>
  <nav class="navbar">
    <navbar-history />
    <navbar-nav />
  </nav>
</template>

<script>
  import NavbarHistory from "./NavbarHistory";
  import NavbarNav from "./NavbarNav";
  import NavbarSearch from "./NavbarSearch";

  export default {
    name: "navbar",

    components: {
      NavbarHistory,
      NavbarSearch,
      NavbarNav
    }
  };
</script>

<style scoped lang="sass">

  .navbar
    display: flex
    height: 40px
    background: $c-shark

    .navbar-history
      display: flex
      margin-left: 6px

    .navbar-search
      display: flex
      align-items: center
      margin-left: 6px

    .navbar-nav
      margin: auto 30px auto auto
</style>
