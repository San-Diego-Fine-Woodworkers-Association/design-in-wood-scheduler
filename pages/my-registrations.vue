<template>
  <div class="max-w-[700px] mx-auto">
    <h1 class="text-2xl font-bold mb-4">
      My Registrations
    </h1>

    <RegistrationList
      :dates="dates"
      @cancel="onCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { flatMap } from 'lodash-es'

import ConfirmCancel from '~/components/Registration/ConfirmCancel.vue'

import type { CancelRegistrationEvent } from '~/components/Registration/CalendarCell.vue'

const calendarStore = useCalendarStore()
const { isAuthorized } = useAuthorizationStore()

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
