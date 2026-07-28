<script setup>
import { RouterView, RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import ToastStack from '../components/ToastStack.vue'

const auth = useAuthStore()
const router = useRouter()

const nav = [
  { to: '/', label: 'Dashboard', icon: '◧', exact: true },
  { to: '/categories', label: 'Kategori', icon: '▤' },
  { to: '/entries', label: 'Kosakata', icon: '✋' },
  { to: '/materials', label: 'Materi', icon: '▥' },
  { to: '/quiz', label: 'Kuis', icon: '？' },
  { to: '/articles', label: 'Artikel', icon: '▦' },
]

async function handleLogout() {
  await auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="shell">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">✋</div>
        <div>
          <strong>Earme</strong>
          <span>Admin Dashboard</span>
        </div>
      </div>

      <nav>
        <RouterLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          :class="{ active: $route.path === item.to }"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <div class="user">
          <div class="avatar">{{ auth.user?.name?.[0]?.toUpperCase() || 'A' }}</div>
          <div class="user-info">
            <strong>{{ auth.user?.name }}</strong>
            <span>{{ auth.user?.email }}</span>
          </div>
        </div>
        <button class="logout-btn" @click="handleLogout">Keluar</button>
      </div>
    </aside>

    <main class="content">
      <RouterView />
    </main>

    <ToastStack />
  </div>
</template>

<style scoped>
.shell {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: var(--sidebar-width);
  flex-shrink: 0;
  background: linear-gradient(165deg, var(--teal-900), var(--teal-600));
  color: white;
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 8px 24px;
}
.brand-mark {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}
.brand strong {
  display: block;
  font-family: var(--font-display);
  font-size: 16px;
}
.brand span {
  display: block;
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.65);
}

nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  border-radius: var(--radius-sm);
  color: rgba(255, 255, 255, 0.75);
  font-size: 14px;
  font-weight: 500;
  transition: background 0.15s ease, color 0.15s ease;
}
.nav-icon {
  width: 18px;
  text-align: center;
  font-size: 14px;
}
.nav-link:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}
.nav-link.active {
  background: var(--clay);
  color: white;
}

.sidebar-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px;
}
.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--clay);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}
.user-info {
  min-width: 0;
}
.user-info strong {
  display: block;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-info span {
  display: block;
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: white;
  padding: 9px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 600;
}
.logout-btn:hover {
  background: rgba(255, 255, 255, 0.16);
}

.content {
  flex: 1;
  padding: 32px 40px;
  min-width: 0;
}

@media (max-width: 860px) {
  .shell {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    height: auto;
    position: static;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }
  nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .sidebar-footer {
    border-top: none;
    flex-direction: row;
    margin-left: auto;
  }
  .user-info { display: none; }
  .content {
    padding: 20px;
  }
}
</style>
