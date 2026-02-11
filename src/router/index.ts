import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import BatchView from '@/views/BatchView.vue'
import OnlineView from '@/views/OnlineView.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    children: [
      {
        path: 'batch',
        name: 'Batch',
        component: BatchView,
      },
      {
        path: 'online',
        name: 'Online',
        component: OnlineView,
      },
      {
        path: '',
        name: 'BatchDefault',
        redirect: '/dashboard/batch', // default to Batch
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
