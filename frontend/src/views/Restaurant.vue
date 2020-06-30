<template>
    <div id="restaurant">
        <Header />
        <RestaurantComponent />
        <div v-if="showModal" class="modal is-active">
            <div class="modal-background"></div>
            <div class="modal-content">
                <div class="modal-box container">
                    Die {{ text }} wurde erfolgreich abgeschlossen.
                </div>
            </div>
            <button class="modal-close is-large" aria-label="close" @click.prevent="closeModal()"></button>
        </div>
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
    },
    data() {
        return {
            showModal: false,
            text: ''
        }
    },
    methods: {
        closeModal() {
            this.showModal = false
        }
    },
    created() {
        if (this.$route.query.order) {
            this.showModal = true
            this.text = 'Bestellung'
        } else if (this.$route.query.reservation) {
            this.showModal = true
            this.text = 'Reservierung'
        }
    }
}
</script>

<style>
#restaurant {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

@media (min-width: 768px) {
    .modal-box {
        max-width: 640px;
        background-color: #fff;
        padding: 16px;
        border-radius: 0.75rem;
    }
}
</style>
