import { identity } from 'lodash-es'
import { defineStore } from 'pinia'

export const useAuthorizationStore = defineStore('authorizationStore', {
  state: () => ({
    showLogin: false,
    pendingLogin: undefined as Promise<boolean | undefined> | undefined,
    loginResolver: null as ((value: boolean | undefined) => void) | null
  }),

  actions: {
    async isAuthorized(cb: (isAllowed?: boolean) => boolean | undefined = identity): Promise<boolean | undefined> {
      const { loggedIn, user } = useUserSession()

      if (loggedIn.value && user.value?.id) return cb(true)
      if (this.pendingLogin !== null && this.showLogin) return this.pendingLogin!.then(cb)

      this.pendingLogin = new Promise(resolve => this.loginResolver = resolve)
      this.showLogin = true

      return this.pendingLogin.then(cb || identity)
    },

    resolvePendingLogin(res: boolean | undefined) {
      if (this.loginResolver) return this.loginResolver(res)
      this.showLogin = false
    }
  }
})
