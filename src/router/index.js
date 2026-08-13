import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../lib/supabase'

import Home from '../views/Home.vue'
import Menu from '../views/Menu.vue'
import Cart from '../views/Cart.vue'
import OrderStatus from '../views/OrderStatus.vue'
import Checkout from '../views/Checkout.vue'

import AdminLogin from '../views/admin/Login.vue'
import AdminDashboard from '../views/admin/Dashboard.vue'
import AdminOrders from '../views/admin/Orders.vue'
import AdminMenu from '../views/admin/Menu.vue'



const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/menu',
      component: Menu,
    },
    {
      path: '/cart',
      component: Cart,
    },
    {
      path: '/order/:id',
      component: OrderStatus,
    },
    {
      path: '/checkout',
      component: Checkout,
    },
    
    {
      path: '/admin/login',
      component: AdminLogin,
    },
    {
      path: '/admin',
      component: AdminDashboard,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/orders',
      component: AdminOrders,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/menu',
      component: AdminMenu,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) {
    return true
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return '/admin/login'
  }

  return true
})

export default router