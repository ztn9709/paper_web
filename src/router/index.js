import * as Vue from 'vue'
import * as VueRouter from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Vue.defineAsyncComponent(() => import('@/views/Home.vue'))
  }
  // {
  //   path: '/materials/:id',
  //   name: 'Material',
  //   props: true,
  //   component: Vue.defineAsyncComponent(() => import('@/views/Material.vue'))
  // }
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes: routes
})

export default router
