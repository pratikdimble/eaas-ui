<template>
  <div>
    <!-- Login Screen -->
    <transition name="fade">
      <div v-if="!loggedIn" class="login-screen d-flex justify-content-center align-items-center">
        <div class="login-card p-4 shadow rounded">
          <h3 class="mb-4 text-center text-primary">EAAS App</h3>

          <div class="form-floating mb-3">
            <input
              type="text"
              v-model="username"
              class="form-control"
              id="username"
              placeholder="Username"
            />
            <label for="username">Username</label>
          </div>

          <div class="form-floating mb-3">
            <input
              type="password"
              v-model="password"
              class="form-control"
              id="password"
              placeholder="Password"
            />
            <label for="password">Password</label>
          </div>

          <button class="btn btn-primary w-100 mb-2" @click="login">Login</button>

          <p v-if="error" class="text-danger mt-2 text-center">{{ error }}</p>
        </div>
      </div>
    </transition>

    <!-- Dashboard with Sidebar + Pages -->
    <transition name="fade">
      <div v-if="loggedIn">
        <router-view @logout="logout" />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { setLoggedIn, clearLoggedIn, loggedIn } from '@/auth.js'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const login = () => {
  // simple dummy login
  if (username.value === 'admin' && password.value === 'admin') {
    setLoggedIn(true)
    error.value = ''
    // Make sure router updates to default nested route
    router.push('/dashboard')
  } else {
    error.value = 'Invalid credentials'
  }
}

const logout = () => {
  clearLoggedIn()
  username.value = ''
  password.value = ''
  router.push('/') // go back to login
}
</script>

<style scoped>
/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

/* Login Screen */
.login-screen {
  height: 100vh;
  background: linear-gradient(to bottom right, #f0f4ff, #e6f2ff);
}

/* Login Card */
.login-card {
  width: 350px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  padding: 2rem;
}

/* Floating labels */
.form-floating input {
  border-radius: 10px;
  padding: 1rem 0.75rem;
}

/* Buttons */
.btn-primary {
  border-radius: 25px;
  padding: 0.75rem;
  font-weight: 500;
}
</style>
