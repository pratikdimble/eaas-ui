declare module '@/auth.js' {
  export function setLoggedIn(value: boolean): void
  export const loggedIn: Ref<boolean>
}
