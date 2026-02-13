declare module '@/auth' {
  import { Ref } from 'vue'

  /**
   * Reactive JWT token
   */
  export const token: Ref<string | null>

  /**
   * Reactive login state (true if token exists)
   */
  export const loggedIn: Ref<boolean>

  /**
   * Save JWT token to ref + localStorage
   */
  export function setToken(jwt: string): void

  /**
   * Clear authentication (logout)
   */
  export function clearAuth(): void
}
