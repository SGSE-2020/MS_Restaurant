import Vue from 'vue'
import Router from 'vue-router'

import Home from './views/Home.vue'
import Restaurant from './views/Restaurant.vue'

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
        }
    ]
})

export default router