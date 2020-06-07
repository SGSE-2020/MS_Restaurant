<template>
  <div id="restaurant">
    <Header />
    <RestaurantComponent />
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import RestaurantComponent from '../components/RestaurantComponent.vue'

export default {
  name: 'Restaurant',
  components: {
    Header,
    RestaurantComponent
  }
}
</script>

<style>
#restaurant {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
