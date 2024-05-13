import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RouteView from '../views/RouteView.vue'
import RouteFeedView from '@/views/RouteFeedView.vue'
import RouteEditView from '@/views/RouteEditView.vue'
import RouteFeedToolbarView from '@/views/RouteFeedToolbarView.vue'

const router = createRouter({
  history: createWebHistory((import.meta as any).env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/route/:id',
      name: 'route',
      component: RouteView,

      children: [
        {
          path: 'feed',
          name: 'route-feed',
          components: {
            content: RouteFeedView,
            toolbar: RouteFeedToolbarView
          }
        },

        {
          path: 'edit',
          name: 'route-edit',
          components: {
            content: RouteEditView
          }
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
