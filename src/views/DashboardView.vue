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
        @click="$emit('logout')"
      >
        <i class="bi bi-box-arrow-left me-2"></i> Logout
      </button>
    </aside>

    <!-- Main Content -->
    <main class="content p-4">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

// Detect current route
const route = useRoute()
const router = useRouter()

const isActive = (path) => route.path === path

// emit logout to App.vue
const logout = () => {
  router.push('/') // go back to login
}
</script>

<style scoped>
nav.nav {
  flex-grow: 1; /* nav fills available space between title and logout */
}

/* Container Layout */
.dashboard-container {
  display: flex;
  height: 100vh;
  background: #f8f9fa; /* light background for main content */
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 220px;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* ensures logout stays at bottom */
  background: linear-gradient(180deg, #2c3e50, #1a242f);
  border-radius: 12px;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.sidebar-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

/* Navigation Links */
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

/* Active Link */
.sidebar-link.active {
  background: #007bff;
  color: #fff;
  font-weight: 600;
}

/* Icons in Sidebar */
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
  flex-shrink: 0; /* prevent it from shrinking */
  margin-top: auto; /* always push to bottom */
  transition: background 0.2s ease;
}

.btn-logout:hover {
  background: #c82333;
}

/* Main Content Area */
.content {
  flex: 1;
  background: #f8f9fa;
  overflow-y: auto;
  padding: 1rem;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .sidebar {
    width: 200px;
  }
}
</style>
