import Vue from 'vue'
import Router from 'vue-router'

import Home from './views/Home.vue'
import Restaurant from './views/Restaurant.vue'
import Order from './views/Order.vue'
import Reservate from './views/Reservate.vue'

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '*',
            redirect: '/'
        },
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/restaurant',
            name: 'restaurant',
            component: Restaurant
        },
        {
            path:'/order',
            name: 'order',
            component: Order
        },
        {
            path:'/reservate',
            name: 'reservate',
            component: Reservate
        }
    ]
})

export default router