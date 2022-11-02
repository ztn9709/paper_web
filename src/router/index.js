import * as VueRouter from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/Search.vue')
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
