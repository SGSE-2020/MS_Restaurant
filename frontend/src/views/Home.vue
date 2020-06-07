<template>
  <div id="home">
    <Header />
    <RestaurantList />
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import RestaurantList from '../components/RestaurantList.vue'

export default {
  name: 'App',
  components: {
    Header,
    RestaurantList
  }
}
</script>

<style>
#home {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
