<template>
    <div>
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
                    <td v-if="dish.priceS">{{ dish.priceS }} €</td>
                    <td v-if="!dish.priceS"></td>
                    <td v-if="dish.priceL">{{ dish.priceL }} €</td>
                    <td v-if="!dish.priceL"></td>
                    <td v-if="dish.priceXL">{{ dish.priceXL }} €</td>
                    <td v-if="!dish.priceXL"></td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import config from '../config.js'

export default {
  name: 'Menu',
  data() {
      return {
          restaurant_id: "45f2xh-d46v421-2an3fz",
          menu: []
      }
  },
  created() {
      fetch(config.url + '/restaurant/' + this.restaurant_id + '/menu').then(response => response.json()).then(json => {
          this.menu = json
      })
  }
}
</script>

<style scoped>
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
</style>
