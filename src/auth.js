import { ref } from 'vue'

// Read token from localStorage
const storedToken = localStorage.getItem('token')

export const token = ref(storedToken || null)
export const loggedIn = ref(!!storedToken)

/**
 * Save JWT token
 */
export function setToken(jwt) {
  token.value = jwt
  loggedIn.value = true
  localStorage.setItem('token', jwt)
}

/**
 * Clear token (logout)
 */
export function clearAuth() {
  token.value = null
  loggedIn.value = false
  localStorage.removeItem('token')
}
