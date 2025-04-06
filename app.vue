<template>
  <UApp
    :toaster="{
      position: 'top-right',
      expand: false
    }"
  >
    <NuxtLayout>
      <NuxtPage :page-key="route => route.fullPath" />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import LoginForm from '~/components/Login/Form.vue'

const { fetch: fetchCalendar } = useCalendarStore()
const authorizationStore = useAuthorizationStore()

await callOnce(fetchCalendar)

const overlay = useOverlay()

const loginModal = overlay.create(LoginForm)

watchEffect(async () => {
  if (authorizationStore.showLogin) {
    const res = await loginModal.open()
    authorizationStore.resolvePendingLogin(res)
  }
})
</script>
