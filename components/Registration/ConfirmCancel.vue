<template>
  <UModal
    title="Cancel Registration"
    :dismissible="!isCancelling"
    @update:open="onOpenUpdate"
  >
    <template #body>
      <div class="flex items-center flex-col w-full">
        <h1 class="font-bold text-2xl">
          {{ cancellation?.area.typeName }}
        </h1>

        <div>
          {{ registrationTimeString }}
        </div>
      </div>
    </template>

    <template #footer>
      <UButton
        variant="outline"
        color="neutral"
        :disabled="isCancelling"
        @click="emit('close')"
      >
        Close
      </UButton>
      <UButton
        ref="cancel-button"
        color="error"
        loading-auto
        @click="onCancel"
      >
        Cancel Registration
      </UButton>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { format } from 'date-fns'

import { map, toNumber } from 'lodash-es'

import type { CancelRegistrationEvent } from './CalendarCell.vue'

const toast = useToast()

const registrationStore = useRegistrationStore()

const cancelButtonRef = useTemplateRef('cancel-button')
const emit = defineEmits(['close'])
const props = defineProps({
  cancellation: {
    default: null,
    type: Object as PropType<CancelRegistrationEvent>
  }
})

const isCancelling = ref(false)

function formatTime(time: string): string {
  const [hours] = map(time.split(':'), toNumber)
  const ampm = hours >= 12 ? 'pm' : 'am'
  const hour = hours % 12 || 12
  return `${hour}${ampm}`
};

const registrationTimeString = computed(() => {
  if (!props.cancellation) {
    return ''
  }

  const dateString = format(props.cancellation?.date, 'MM/dd')
  const start = formatTime(props.cancellation?.area.time.start)
  const end = formatTime(props.cancellation?.area.time.end)

  return `${dateString}, ${start} - ${end}`
})

async function onCancel() {
  isCancelling.value = true

  const regID = props.cancellation?.area.time.registration
  if (!regID) {
    return
  }

  await registrationStore.cancel(regID)

  toast.add({
    title: 'Cancelled Registration',
    description: `Registration for for ${props.cancellation.area.typeName} on ${registrationTimeString.value} cancelled.`,
    color: 'success'
  })

  isCancelling.value = false
  emit('close', true)
}

function onOpenUpdate(openStatus: boolean) {
  if (openStatus) cancelButtonRef.value?.$el.focus()
}
</script>
