import { ref } from 'vue'

// Read saved value from localStorage (or false if none)
const stored = localStorage.getItem('loggedIn') === 'true'

export const loggedIn = ref(stored)

/**
 * Updates loggedIn both in the reactive ref and localStorage.
 * @param {boolean} val
 */
export function setLoggedIn(val) {
  loggedIn.value = val
  localStorage.setItem('loggedIn', val ? 'true' : 'false')
}

/**
 * Clears login state from both ref and storage.
 */
export function clearLoggedIn() {
  loggedIn.value = false
  localStorage.removeItem('loggedIn')
}
