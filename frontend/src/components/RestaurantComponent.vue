<template>
    <div class="container content">
        <div class="tile is-ancestor is-vertical">
            <div class="restaurant-header tile is-12 level">
                <div class="level-left">
                    <img src="restaurant_bg.png" alt="Restaurant Icon">
                    <h4>{{ restaurant_info.name }}</h4>
                </div>
                <div v-if="restaurant_info">
                    <b-button class="button-column button-green-bg margin-top-button" v-if="restaurant_info.reservationsAllowed">Tisch reservieren</b-button>
                    <b-button class="button-column button-green-bg margin-top-button" v-if="restaurant_info.ordersAllowed">Bestellen</b-button>
                </div>
            </div>
            <div class="restaurant-tile tile is-12">
                <div class="tile is-child is-8">
                    <Menu />
                </div>
                <div class="restaurant-info tile is-child is-4 border-left">
                    <img src="restaurant_bg.png" alt="Restaurant Icon">
                    <h4>{{ restaurant_info.name }}</h4>
                    <p>
                        Öffnungszeiten:<br>
                        Montag: {{ restaurant_info.openingHours[0].from }}-{{ restaurant_info.openingHours[0].to }} Uhr<br>
                        Dienstag: {{ restaurant_info.openingHours[1].from }}-{{ restaurant_info.openingHours[1].to }} Uhr<br>
                        Mittwoch: {{ restaurant_info.openingHours[2].from }}-{{ restaurant_info.openingHours[2].to }} Uhr<br>
                        Donnerstag: {{ restaurant_info.openingHours[3].from }}-{{ restaurant_info.openingHours[3].to }} Uhr<br>
                        Freitag: {{ restaurant_info.openingHours[4].from }}-{{ restaurant_info.openingHours[4].to }} Uhr<br>
                        Samstag: {{ restaurant_info.openingHours[5].from }}-{{ restaurant_info.openingHours[5].to }} Uhr<br>
                        Sonntag: {{ restaurant_info.openingHours[6].from }}-{{ restaurant_info.openingHours[6].to }} Uhr<br>
                    </p>
                    <h5>Beschreibung</h5>
                    <p>{{ restaurant_info.description }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import config from '../config.js'
import Menu from './Menu.vue'

export default {
  name: 'RestaurantComponent',
  components: {
    Menu
  },
  data() {
      return {
          restaurant_id: "1234",
          restaurant_info: null
      }
  },
  created() {
      fetch('http://' + config.url + '/restaurant/' + this.restaurant_id).then(response => response.json()).then(json => {
          this.restaurant_info = json
      })
  }
}
</script>

<style>
.restaurant-header {
    background-color: #2c3e50;
    padding: 8px;
    border-radius: 1rem;
    margin-bottom: 16px;
}

.restaurant-header h4 {
    margin-bottom: 0px;
    font-size: x-large;
    font-weight: 700;
    color: #42b983;
}

.restaurant-header img {
    height: 64px;
    background-color: #2c3e50;
    border-radius: 1rem;
}

.margin-top-button {
    margin-top: 15px;
}

.restaurant-info {
    padding: 0 16px;
}

.restaurant-info h4 {
    text-align: left;
    color: #42b983;
    margin-bottom: 8px;
}

.content {
    margin: 0 auto;
    margin-top: 76px;
    display: block;
    height: 100%;
}

@media (min-width: 769px) {
    .border-left {
        border-left: 0.05rem solid #2c3e50;
    }
}

@media (max-width: 768px) {
    .content {
        margin: 0 auto;
        margin-top: 228px;
    }
}

@media (max-width: 300px) {
    .content {
        margin: 0 auto;
        margin-top: 260px;
    }
}
</style>