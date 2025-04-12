<template>
  <UApp
    :toaster="{
      position: 'top-right',
      expand: false
    }"
  >
    <NuxtLayout>
      <NuxtLoadingIndicator />
      <NuxtPage :page-key="route => route.fullPath" />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import LoginForm from '~/components/Login/Form.vue'

const authorizationStore = useAuthorizationStore()
const calendarStore = useCalendarStore()

callOnce(calendarStore.fetch)

const overlay = useOverlay()

const loginModal = overlay.create(LoginForm)

watchEffect(async () => {
  if (authorizationStore.showLogin) {
    const res = await loginModal.open()
    authorizationStore.resolvePendingLogin(res)
  }
})
</script>
