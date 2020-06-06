<template>
    <div class="content container">
        <h2>Willkommen bei Smart City - Restaurants.</h2>
        <p>Bestellen sie ihre Lieblingsgerichte und reservieren sie Tische direkt online in ihrem Lieblingsrestaurant.</p>
        <div>
            <div v-for="restaurants_line in restaurants" v-bind:key="restaurants_line" class="card-line columns">
                <div v-for="restaurant in restaurants_line" v-bind:key="restaurant.restaurantID" class="restaurant-card colmn">
                    <div>
                        <img src="restaurant_bg.png" alt="Restaurant Icon">
                        <h3>{{ restaurant.name }}</h3>
                        <p>{{ restaurant.description }}</p>
                        <b-button class="restaurant-button button-green-bg" @click.prevent="">Ansehen</b-button>
                        <router-link to="/restaurant">Ansehen</router-link>
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
          /*this.restaurants = [[], [], []]
          for (var i = 0; i < json.length; i=i+3) {
              if (i < json.length)
                this.restaurants[0].push(json[i])
              if (i+1 < json.length)
                this.restaurants[1].push(json[i+1])
              if (i+2 < json.length)
                this.restaurants[2].push(json[i+2])
          }
          console.log(this.restaurants)*/
          let [...arr] = json
          while(arr.length) {
              this.restaurants.push(arr.splice(0,3))
          }
      })
  }
}
</script>

<style scoped>
.button-green-bg {
  background-color: #42b983;
  border-color: transparent;
  color: #fff;
}

.button-green-bg:hover {
  background-color: #34af80;
  border-color: transparent;
  color: #fff;
}

.button-green-bg:focus {
  background-color: #42b983;
  border-color: transparent;
  color: #fff;
}

.content {
    margin-top: 72px;
}

h2 {
    font-size: larger;
    font-weight: bold;
}

.card-line {
    margin: 0;
}

.restaurant-card {
    padding: 8px;
    padding-top: 0px;
    padding-bottom: 16px;
    max-width: 33.333334%;
}

.restaurant-card div {
    color: #fff;
    background-color: #2c3e50;
    border-radius: 1rem;
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

@media (max-width: 768px) {
    .restaurant-card {
        max-width: 100%;
    }

    .content {
        margin-top: 224px;
    }
}

@media (max-width: 300px) {
    .content {
        margin-top: 256px;
    }
}
</style>