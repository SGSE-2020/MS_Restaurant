<template>
    <div id="restaurant">
        <Header />
        <div class="container reservate-content">
            <div v-if="restaurant_info" class="tile is-ancestor is-vertical">
                <div class="restaurant-header tile is-12 level">
                    <div class="level-left">
                        <img src="restaurant_bg.png" alt="Restaurant Icon">
                        <h4 v-if="restaurant_info">{{ restaurant_info.name }}</h4>
                    </div>
                    <div v-if="restaurant_info">
                        <router-link :to="{name: 'restaurant', query: {restaurant_id: restaurant_info.restaurantID}}"><b-button class="button-column button-green-bg margin-top-button">Zu den Restaurant Infos</b-button></router-link>
                    </div>
                </div>
                <div v-if="restaurant_info && restaurant_info.reservationsAllowed" class="restaurant-tile tile is-12">
                    <form class="reservate-form">
                        <h1>Tisch reservieren</h1>
                        <div class="field">
                            <label class="label">Zeitpunkt</label>
                            <div class="tile">
                                <input class="input tile is-8" type="date">
                                <input class="input tile is-4" type="time">
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Personenanzahl</label>
                            <input class="input" type="number">
                        </div>
                        <b-button v-if="restaurant_info.reservationsAllowed" class="button button-green-bg margin-top-button level-right">Tisch reservieren</b-button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '../components/Header.vue'
import config from '../config.js'

export default {
    name: 'App',
    components: {
      Header
    },
    data() {
        return {
            restaurant_info: null
        }
    },
    created() {
        fetch(config.url + '/restaurant/' + this.$route.query.restaurant_id).then(response => response.json()).then(json => {
            this.restaurant_info = json
        })
    }
}
</script>

<style>
#reservate {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

.restaurant-header {
    background-color: #2c3e50;
    padding: 8px;
    border-radius: 1rem;
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

.restaurant-info {
    padding: 0 16px;
}

.restaurant-info h4 {
    text-align: left;
    color: #42b983;
    margin-bottom: 8px;
}

.reservate-content {
    margin: 0 auto;
    margin-top: 76px;
    display: block;
    height: 100%;
}

.reservate-form {
    max-width: 768px;
    margin: 0 auto;
    min-width: 300px;
}

@media (min-width: 769px) {
    .border-left {
        border-left: 0.05rem solid #2c3e50;
    }

    .reservate-form {
        min-width: 512px;
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
