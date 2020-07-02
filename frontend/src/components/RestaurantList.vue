<template>
    <div class="content container">
        <h2>Willkommen bei Smart City - Restaurants.</h2>
        <p>Bestellen sie ihre Lieblingsgerichte und reservieren sie Tische direkt online in ihrem Lieblingsrestaurant.</p>
        <div>
            <div v-for="restaurants_line in restaurants" v-bind:key="restaurants_line.id" class="card-line columns">
                <div v-for="restaurant in restaurants_line.data" v-bind:key="restaurant.restaurantID" class="restaurant-card column">
                    <div>
                        <img src="restaurant_bg.png" alt="Restaurant Icon">
                        <h3>{{ restaurant.name }}</h3>
                        <p>{{ restaurant.description }}</p>
                        <router-link :to="{name: 'restaurant', query: {restaurant_id: restaurant.restaurantID}}" class="link">Ansehen</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import config from '../config.js'

export default {
    name: 'RestaurantList',
    data() {
        return {
            restaurants: []
        }
    },
    created() {
        fetch(config.url + '/restaurants').then(response => response.json()).then(json => {
            let [...arr] = json
            let i = 0
            while(arr.length) {
                this.restaurants.push({id: i, data: arr.splice(0,3)})
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
    min-height: 490px;
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

.restaurant-card img {
    width: 100%;
    border-radius: 1rem;
}

.link {
    margin: 0px;
    display: block;
    width: 100%;
    color: #fff;
    padding-bottom: calc(0.375em - 1px);
    padding-left: 0.75em;
    padding-right: 0.75em;
    padding-top: calc(0.375em - 1px);
    background-color: #42b983;
    border-width: 1px;
    border: 1px solid transparent;
    border-radius: 4px;
}

.link:hover {
    color: #fff;
    background-color: #34af80;
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
