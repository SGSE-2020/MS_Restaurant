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
                                <input class="input tile is-8" type="date" v-model="date">
                                <input class="input tile is-4" type="time" v-model="time">
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Personenanzahl</label>
                            <input class="input" type="number" v-model="person_count">
                        </div>
                        <div class="field">
                            <input type="checkbox" v-model="do_parking"> Parkplatz mitreservieren
                        </div>
                        <div v-if="do_parking" class="field">
                            <label class="label">Parkplatzanzahl</label>
                            <input class="input" type="number" v-model="parking_spot_count">
                        </div>
                        <div class="note field">
                            <label class="label">Anmerkung</label>
                            <textarea class="textarea" rows="2" v-model="note"></textarea>
                        </div>
                        <p class="has-text-danger">{{ error_msg }}</p>
                        <b-button v-if="restaurant_info.reservationsAllowed" class="button button-green-bg margin-top-button level-right" @click.prevent="reservate()">Tisch reservieren</b-button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from '../components/Header.vue'
import config from '../config.js'
import router from '../router'

export default {
    name: 'Reservate',
    components: {
      Header
    },
    data() {
        return {
            restaurant_info: null,
            note: "",
            date: null,
            time: null,
            person_count: 0,
            error_msg: "",
            do_parking: false,
            parking_spot_count: 0
        }
    },
    methods: {
        reservate() {
            fetch(config.url + '/restaurant/' + this.$route.query.restaurant_id + '/reservate', {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify({
                    note: this.note,
                    date: this.date,
                    time: this.time,
                    person_count: this.person_count,
                    parking_spot_count: this.parking_spot_count
                })
            }).then(response => response.json()).then((json) => {
                if (json.error) {
                    console.log(json.error)
                    this.error_msg = "Es ist ein Fehler bei der Reservierung aufgetreten."
                } else {
                    router.push({'name': 'restaurant', query: {restaurant_id: this.$route.query.restaurant_id, reservation: true}})
                }
            }).catch((err) => {
                console.log(err)
                this.error_msg = "Es ist ein Fehler bei der Reservierung aufgetreten."
            })
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
