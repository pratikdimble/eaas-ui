<template>
  <div class="container-fluid">
    <div class="row">
      <!-- Sidebar -->
      <div class="col-2 bg-dark text-white vh-100 p-3">
        <h5 class="mb-4">Menu</h5>

        <!-- NOTE: Use full paths here -->
        <router-link class="btn btn-outline-light w-100 mb-2" to="/dashboard/batch">
          Batch
        </router-link>

        <router-link class="btn btn-outline-light w-100 mb-2" to="/dashboard/online">
          Online
        </router-link>

        <button class="btn btn-danger w-100 mt-4" @click="$emit('logout')">Logout</button>
      </div>

      <!-- Main Content -->
      <div class="col-10 p-4">
        <!-- This renders child views: BatchView or OnlineView -->
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
// No need to import anything here
</script>

<style scoped>
.bg-dark {
  min-height: 100vh;
}
</style>
