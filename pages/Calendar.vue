<template>
  <RegistrationCalendar
    :is-loading="calendarStore.isLoading"
    :calendar="calendarStore.calendar"
    @register="onRegister"
    @cancel="onCancel"
  />
</template>

<script setup lang="ts">
import type { Registration } from '~/components/Registration/calendar'
import ConfirmAdd from '~/components/Registration/ConfirmAdd.vue'
import ConfirmCancel from '~/components/Registration/ConfirmCancel.vue'

const { isAuthorized } = useAuthorizationStore()
const calendarStore = useCalendarStore()

const overlay = useOverlay()

const confirmAddModal = overlay.create(ConfirmAdd)
const confirmCancelModal = overlay.create(ConfirmCancel)

async function onRegister(registration: Registration) {
  const allowed = await isAuthorized()

  if (!allowed) return
  confirmAddModal.patch({ registration })

  confirmAddModal.open()
}

async function onCancel(registration: Registration) {
  const allowed = await isAuthorized()

  if (!allowed) return
  confirmCancelModal.patch({ registration })

  confirmCancelModal.open()
}
</script>
