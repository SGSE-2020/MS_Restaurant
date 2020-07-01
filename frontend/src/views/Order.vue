<template>
  <div id="restaurant">
    <Header />
    <div class="container order-content">
        <div class="tile is-ancestor is-vertical">
            <div class="restaurant-header tile is-12 level">
                <div class="level-left">
                    <img src="restaurant_bg.png" alt="Restaurant Icon">
                    <h4 v-if="restaurant_info">{{ restaurant_info.name }}</h4>
                </div>
                <div v-if="restaurant_info">
                    <router-link :to="{name: 'restaurant', query: {restaurant_id: restaurant_info.restaurantID}}"><b-button class="button-column button-green-bg margin-top-button">Zu den Restaurant Infos</b-button></router-link>
                </div>
            </div>
            <div class="restaurant-tile tile is-12">
                <div class="tile is-child is-8 content">
                    <div v-if="menu">
                        <h1>Speisekarte</h1>
                        <div class="category_list" v-for="category in menu" v-bind:key="category.name">
                            <p class="category_header">{{ category.name }}</p>
                            <table>
                                <tr>
                                    <th>Nr</th>
                                    <th>Name</th>
                                    <th>Beschreibung</th>
                                    <th>Preis S</th>
                                    <th>Preis L</th>
                                    <th>Preis XL</th>
                                </tr>
                                <tr v-for="dish in category.dishes" v-bind:key="dish.id">
                                    <td>{{ dish.id }}</td>
                                    <td>{{ dish.name }}</td>
                                    <td>{{ dish.description }}</td>
                                    <td v-if="dish.priceS"><button class="button is-outlined is-outlined-green" @click.prevent="addDish(dish, dish.priceS)">{{ dish.priceS }} €</button></td>
                                    <td v-if="!dish.priceS"></td>
                                    <td v-if="dish.priceL"><button class="button is-outlined is-outlined-green" @click.prevent="addDish(dish, dish.priceL)">{{ dish.priceL }} €</button></td>
                                    <td v-if="!dish.priceL"></td>
                                    <td v-if="dish.priceXL"><button class="button is-outlined is-outlined-green" @click.prevent="addDish(dish, dish.priceXL)">{{ dish.priceXL }} €</button></td>
                                    <td v-if="!dish.priceXL"></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
                <div v-if="restaurant_info" class="restaurant-info tile is-child is-4 border-left">
                    <h1>Bestellliste</h1>
                    <p v-if="orderList.length == 0 && restaurant_info.ordersAllowed">Füge deiner Bestellliste Gerichte hinzu.</p>
                    <div v-for="order in orderList" v-bind:key="order.id" class="order-item border-bottom level">
                        <div class="level-left">
                            <p class="no-margin">{{ order.dish.id }}: {{ order.dish.name }} - {{ order.price }} €</p>
                        </div>
                        <div>
                            <button class="order-button button is-small button-column button-green-bg margin-top-button" @click.prevent="removeOrder(order.id)">Entfernen</button>
                        </div>
                    </div>
                    <div v-if="orderList.length > 0 && restaurant_info.ordersAllowed" class="note field">
                        <label class="label">Anmerkung</label>
                        <textarea class="textarea" rows="2" v-model="note"></textarea>
                    </div>
                    <p class="has-text-danger">{{ error_msg }}</p>
                    <div class="level">
                        <p v-if="orderList.length > 0 && restaurant_info.ordersAllowed" class="overallCost level-left">Gesamtpreis: {{ overallPrice }} €</p>
                        <b-button v-if="orderList.length > 0 && restaurant_info.ordersAllowed" class="button button-green-bg margin-top-button level-right" @click.prevent="order()">Bestellen</b-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header.vue'
import config from '../config.js'
import router from '../router'

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default {
    name: 'Order',
    components: {
        Header
    },
    data() {
        return {
            restaurant_info: null,
            menu: null,
            orderList: [],
            note: "",
            error_msg: ""
        }
    },
    computed: {
        overallPrice: function() {
            let price = 0
            for (var order of this.orderList) {
                price += order.price
            }
            return price.toFixed(2)
        }
    },
    methods: {
        addDish(dish, price) {
            this.orderList.push({id: uuidv4(), dish: dish, price: price})
        },

        removeOrder(order_id) {
            var order = null
            for (var i in this.orderList) {
                if (this.orderList[i].id == order_id) {
                    order = i
                }
            }
            if (order) {
                this.orderList.splice(order, 1)
            }
        },

        order() {
            var order = {
                "orders": this.orderList,
                "note": this.note
            }
            fetch(config.url + '/restaurant/' + this.$route.query.restaurant_id + '/order', {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify(order)
            }).then(response => response.json()).then((json) => {
                if (json.error) {
                    console.log(json.error)
                    this.error_msg = "Es ist ein Fehler bei der Bestellung aufgetreten."
                } else {
                    router.push({'name': 'restaurant', query: {restaurant_id: this.$route.query.restaurant_id, order: true}})
                }
            }).catch((err) => {
                console.log(err)
                this.error_msg = "Es ist ein Fehler bei der Bestellung aufgetreten."
            })
        }
    },
    created() {
        fetch(config.url + '/restaurant/' + this.$route.query.restaurant_id).then(response => response.json()).then(json => {
            this.restaurant_info = json
        })
        fetch(config.url + '/restaurant/' + this.$route.query.restaurant_id + '/menu').then(response => response.json()).then(json => {
            this.menu = json
        })
    }
}
</script>

<style scoped>
#restaurant {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
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

.order-content {
    margin: 0 auto;
    margin-top: 76px;
    display: block;
    height: 100%;
}

.is-outlined-green {
    background-color: transparent;
    border-color: #42b983;
    color: #42b983;
}

.border-bottom {
    border-bottom: 0.05rem solid #2c3e50;
}

.order-button {
    border-radius: 6px;
}

.order-item {
    margin-bottom: 0;
}

.no-margin {
    margin: 0;
    margin-bottom: 0;
}

.overallCost {
    margin-top: 16px;
}

.note {
    margin-top: 32px;
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

@media (max-width: 300px) {
    .content {
        margin: 0 auto;
        margin-top: 260px;
    }
}

.category_header {
    background-color: #2c3e50;
    color: #fff;
    border-radius: 8px;
    padding: 8px;
    padding-left: 12px;
    margin-bottom: 0;
}

.category_list {
    margin-right: 8px;
    margin-bottom: 32px;
}

h1 {
    color: #42b983;
    font-size: 2em;
    margin-bottom: 0.5em;
    font-weight: 600;
    line-height: 1.125;
}
</style>
