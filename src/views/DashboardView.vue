<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <aside class="sidebar d-flex flex-column p-3">
      <h5 class="sidebar-title text-white">Menu</h5>

      <nav class="nav flex-column mb-3">
        <router-link
          to="/dashboard/batch"
          class="nav-link d-flex align-items-center sidebar-link"
          :class="{ active: isActive('/dashboard/batch') }"
        >
          <i class="bi bi-stack me-2"></i> Batch
        </router-link>

        <router-link
          to="/dashboard/online"
          class="nav-link d-flex align-items-center sidebar-link"
          :class="{ active: isActive('/dashboard/online') }"
        >
          <i class="bi bi-globe me-2"></i> Online
        </router-link>
      </nav>

      <button
        class="btn btn-logout mt-auto d-flex align-items-center justify-content-center"
        @click="logout"
      >
        <i class="bi bi-box-arrow-left me-2"></i> Logout
      </button>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Header with Download Controls -->
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h3 class="mb-0">EAAS Dashboard</h3>
      </div>

      <!-- Renders pages like Online / Batch -->
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { clearAuth } from '@/auth.js'

// Detect current route
const route = useRoute()
const router = useRouter()

const isActive = (path) => route.path === path

const logout = () => {
  clearAuth()()
  router.push('/') // go back to login
}
</script>

<style scoped>
/* ---- Layout Container ---- */
.dashboard-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* ---- Sidebar ---- */
.sidebar {
  width: 220px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(180deg, #2c3e50, #1a242f);
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  position: fixed;
  top: 0;
  bottom: 0;
}

/* Sidebar Title */
.sidebar-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

/* Sidebar Links */
.sidebar-link {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 0.6rem;
  font-weight: 500;
  color: #ddd;
  transition:
    background 0.2s,
    color 0.2s,
    transform 0.15s;
}

.sidebar-link:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  transform: translateX(3px);
}

.sidebar-link.active {
  background: #007bff;
  color: #fff;
  font-weight: 600;
}

.sidebar-link i {
  font-size: 1.2rem;
}

/* Logout Button */
.btn-logout {
  background: #dc3545;
  color: #fff;
  padding: 0.85rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  width: 100%;
  margin-top: auto;
}

.btn-logout:hover {
  background: #c82333;
}

/* ---- Main Content ---- */
.main-content {
  margin-left: 220px;
  flex: 1;
  background: #f8f9fa;
  overflow-y: auto;
  padding: 1rem;
}

/* Buttons */
.btn-success {
  margin-left: 0.5rem;
}
</style>
