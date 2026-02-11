<template>
  <div class="login-screen d-flex justify-content-center align-items-center">
    <div class="login-card p-4 shadow rounded">
      <h3 class="mb-4 text-center text-primary">EAAS App</h3>

      <div class="form-floating mb-3">
        <input type="text" v-model="username" class="form-control" placeholder="Username" />
        <label>Username</label>
      </div>

      <div class="form-floating mb-3">
        <input type="password" v-model="password" class="form-control" placeholder="Password" />
        <label>Password</label>
      </div>

      <button class="btn btn-primary w-100" @click="login">Login</button>

      <p v-if="error" class="text-danger mt-2 text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const login = () => {
  if (username.value === 'admin' && password.value === 'admin') {
    loggedIn.value = true
    error.value = ''
    router.push('/dashboard') // redirect to dashboard after login
  } else {
    error.value = 'Invalid credentials'
  }
}
</script>

<style scoped>
.login-screen {
  height: 100vh;
  background: linear-gradient(to bottom right, #f0f4ff, #e6f2ff);
}
.login-card {
  width: 350px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  padding: 2rem;
}
.form-floating input {
  border-radius: 10px;
  padding: 1rem 0.75rem;
}
.btn-primary {
  border-radius: 25px;
  padding: 0.75rem;
  font-weight: 500;
}
</style>
