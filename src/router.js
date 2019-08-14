import Vue from 'vue'
import Router from 'vue-router'
import Main from './layout/main'
import Default from './layout/default'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main,
      children: [
        {
          path: '/tasks',
          component: () => import('./views/tasks.vue')
        }
      ]
    },
    {
      path: '/user',
      name: 'user',
      component: Default,
      children: [
        {
          name: 'userLogin',
          path: 'login',
          component: () => import('./views/user/login.vue')
        },
        {
          name: 'userReg',
          path: 'registered',
          component: () => import('./views/user/login.vue')
        }
      ]
    }
    /* {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/!* webpackChunkName: "about" *!/ './views/About.vue')
    } */
  ]
})
