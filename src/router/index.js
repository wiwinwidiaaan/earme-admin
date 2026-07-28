import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'dashboard', component: () => import('../views/DashboardView.vue') },
      { path: 'categories', name: 'categories', component: () => import('../views/categories/CategoryListView.vue') },
      { path: 'entries', name: 'entries', component: () => import('../views/entries/EntryListView.vue') },
      { path: 'materials', name: 'materials', component: () => import('../views/materials/MaterialListView.vue') },
      { path: 'quiz', name: 'quiz', component: () => import('../views/quiz/QuizListView.vue') },
      { path: 'articles', name: 'articles', component: () => import('../views/articles/ArticleListView.vue') },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }
})

export default router
