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
    path: '/recent',
    name: 'Recent',
    component: () => import('@/views/List.vue')
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
