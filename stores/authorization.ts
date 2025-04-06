import { defineStore } from 'pinia'

export const useAuthorizationStore = defineStore('authorizationStore', {
  state: () => ({
    showLogin: false,
    pendingLogin: null as Promise<boolean | undefined> | null,
    loginResolver: null as ((value: boolean | undefined) => void) | null
  }),

  actions: {
    async isAuthorized() {
      const { loggedIn, user } = useUserSession()

      if (loggedIn.value && user.value?.id) return true
      if (this.pendingLogin !== null && this.showLogin) return this.pendingLogin

      this.pendingLogin = new Promise(resolve => this.loginResolver = resolve)
      this.showLogin = true

      return this.pendingLogin
    },

    resolvePendingLogin(res: boolean | undefined) {
      if (this.loginResolver) this.loginResolver(res)
      this.showLogin = false
    }
  }
})
