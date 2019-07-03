import Vue from 'vue'
import Router from 'vue-router'
import Home from 'views/pages/Home.vue'
import Media from 'views/pages/Media'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('views/pages/About.vue'),
        },
        {
            path: '/dropzone',
            name: 'dropzone',
            component: Media,
        },
    ],
})
