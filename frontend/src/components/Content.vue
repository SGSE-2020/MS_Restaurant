<template>
    <div class="content container">
        <h2>Willkommen bei Smart City - Restaurants.</h2>
        <p>Bestellen sie ihre Lieblingsgerichte und reservieren sie Tische direkt online in ihrem Lieblingsrestaurant.</p>
        <div>
            <div class="tile is-parent">
                <div v-for="restaurant in restaurants" v-bind:key="restaurant.restaurantID" class="restaurant-card tile is-4">
                    <div>
                        <img src="restaurant_bg.png" alt="Restaurant Icon">
                        <h3>{{ restaurant.name }}</h3>
                        <p>{{ restaurant.description }}</p>
                        <b-button class="restaurant-button" type="is-success" @click.prevent="">Ansehen</b-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import config from '../config.js'

export default {
  name: 'Content',
  data() {
      return {
          restaurants: []
      }
  },
  created() {
      fetch('http://' + config.url + '/restaurants').then(response => response.json()).then(json => {
          this.restaurants = json
          /*for (var i = 0; i < json.length; i+3) {
              this.restaurants.push(json.slice(i, i+3))
          }*/
          console.log(this.restaurants)
      })
  }
}
</script>

<style scoped>
.content {
    margin-top: 88px;
}

h2 {
    font-size: larger;
    font-weight: bold;
}

.restaurant-card {
    color: #fff;
    background-color: #2c3e50;
    border-radius: 1rem;
    margin: 8px;
    padding: 16px;
}

.restaurant-card h3 {
    color: #fff;
    text-align: left;
}

.restaurant-card p {
    text-align: left;
}

.restaurant-card .restaurant-button {
    width: 100%;
}

.restaurant-card img {
    width: 100%;
    border-radius: 1rem;
}
</style>