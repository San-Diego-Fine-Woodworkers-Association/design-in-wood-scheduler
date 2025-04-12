<template>
  <PageContainer
    title="My Registrations"
    max-width="md"
  >
    <RegistrationList
      :dates="dates"
      @cancel="onCancel"
    />
  </PageContainer>
</template>

<script setup lang="ts">
import { flatMap } from 'lodash-es'

import ConfirmCancel from '~/components/Registration/ConfirmCancel.vue'

import type { CancelRegistrationEvent } from '~/components/Registration/CalendarCell.vue'

const calendarStore = useCalendarStore()
const { isAuthorized } = useAuthorizationStore()

useAsyncData(() => calendarStore.fetch())

const overlay = useOverlay()
const confirmCancelModal = overlay.create(ConfirmCancel)
const dates = computed(() => flatMap(calendarStore.calendar, ({ dates }) => dates))

async function onCancel(cancellation: CancelRegistrationEvent) {
  const allowed = await isAuthorized()

  if (!allowed) return
  confirmCancelModal.patch({ cancellation })

  confirmCancelModal.open()
}
</script>
