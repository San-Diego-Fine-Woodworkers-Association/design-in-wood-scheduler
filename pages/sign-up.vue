<template>
  <PageContainer title="Sign-Up">
    <RegistrationCalendar
      :is-loading="calendarStore.isLoading"
      :calendar="calendarStore.calendar"
      @register="onRegister"
      @cancel="onCancel"
    />
  </PageContainer>
</template>

<script setup lang="ts">
import ConfirmAdd from '~/components/Registration/ConfirmAdd.vue'
import ConfirmCancel from '~/components/Registration/ConfirmCancel.vue'

import type { RegisterEvent, CancelRegistrationEvent } from '~/components/Registration/CalendarCell.vue'

const { isAuthorized } = useAuthorizationStore()
const calendarStore = useCalendarStore()

useAsyncData(() => calendarStore.fetch())

const overlay = useOverlay()

const confirmAddModal = overlay.create(ConfirmAdd)
const confirmCancelModal = overlay.create(ConfirmCancel)

async function onRegister(registration: RegisterEvent) {
  const allowed = await isAuthorized()

  if (!allowed) return
  confirmAddModal.patch({ registration })

  confirmAddModal.open()
}

async function onCancel(cancellation: CancelRegistrationEvent) {
  const allowed = await isAuthorized()

  if (!allowed) return
  confirmCancelModal.patch({ cancellation })

  confirmCancelModal.open()
}
</script>
