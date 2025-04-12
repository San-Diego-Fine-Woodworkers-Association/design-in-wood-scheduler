<template>
  <AdminPageContainer
    title="Registrations"
    :wrap="false"
  >
    <RegistrationCalendar
      v-if="!adminCalendarStore.error"
      :is-loading="adminCalendarStore.isLoading"
      :calendar="adminCalendarStore.calendar"
      @register="onRegister"
      @cancel="onCancel"
    />
  </AdminPageContainer>
</template>

<script setup lang="ts">
import { AdminPageContainer, RegistrationCalendar } from '#components'

import ConfirmAdd from '~/components/Registration/ConfirmAdd.vue'
import ConfirmCancel from '~/components/Registration/ConfirmCancel.vue'

import type { RegisterEvent, CancelRegistrationEvent } from '~/components/Registration/CalendarCell.vue'

const { isAuthorized } = useAuthorizationStore()
const adminCalendarStore = useAdminCalendarStore()

const overlay = useOverlay()

const confirmAddModal = overlay.create(ConfirmAdd)
const confirmCancelModal = overlay.create(ConfirmCancel)

useAsyncData(() => adminCalendarStore.fetch())

async function onRegister(registration: RegisterEvent) {
  const allowed = await isAuthorized()

  if (!allowed) return
  confirmAddModal.patch({ registration })

  await confirmAddModal.open()
}

async function onCancel(cancellation: CancelRegistrationEvent) {
  const allowed = await isAuthorized()

  if (!allowed) return
  confirmCancelModal.patch({ cancellation })

  await confirmCancelModal.open()
}
</script>
