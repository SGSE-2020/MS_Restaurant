<template>
    <div class="container content">
        <div class="tile is-ancestor is-vertical">
            <div class="restaurant-header tile is-12">
                <img src="restaurant_bg.png" alt="Restaurant Icon">
                <h4>Restaurant Name</h4>
            </div>
            <div class="restaurant-tile tile is-12">
                <div class="tile is-child is-8">
                    <Menu />
                </div>
                <div class="restaurant-info tile is-child is-4 border-left">
                    <h4>Restaurant Name</h4>
                    <p>
                        Öffnungszeiten:<br>
                        Montag: 16-22 Uhr<br>
                        Dienstag: 16-22 Uhr<br>
                        Mittwoch: 16-22 Uhr<br>
                        Donnerstag: 16-22 Uhr<br>
                        Freitag: 16-22 Uhr<br>
                        Samstag: 12-24 Uhr<br>
                        Sonntag: 12-24 Uhr<br>
                        Aktuell geschlossen
                    </p>
                    <p>Beschreibung</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Menu from './Menu.vue'

export default {
  name: 'RestaurantComponent',
  components: {
    Menu
  }
}
</script>

<style>
.restaurant-header {
    background-color: #2c3e50;
    padding: 12px;
    border-radius: 1rem;
    margin-bottom: 16px;
}

.restaurant-header h4 {
    margin-top: 30px;
    font-size: xx-large;
    font-weight: 700;
    color: #42b983;
}

.restaurant-header img {
    height: 96px;
    background-color: #2c3e50;
    border-radius: 1rem;
}

.restaurant-tile {
}

.restaurant-info {
    padding: 0 16px;
    height: 100%;
}

.restaurant-info h4 {
    text-align: left;
    color: #42b983;
    margin-bottom: 8px;
}

.content {
    margin: 0 auto;
    margin-top: 76px;
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