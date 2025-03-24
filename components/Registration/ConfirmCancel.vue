<template>
  <UModal
    title="Cancel Registration"
    :dismissible="!isCancelling"
  >
    <template #body>
      <div class="flex items-center flex-col w-full">
        <h1 class="font-bold text-2xl">
          {{ registration?.area.typeName }}
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
        color="error"
        variant="solid"
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
import type { Registration } from './calendar'

const toast = useToast()

const registrationStore = useRegistrationStore()

const emit = defineEmits(['close'])
const props = defineProps({
  registration: {
    default: null,
    type: Object as PropType<Registration>
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
  if (!props.registration) {
    return ''
  }

  const dateString = format(props.registration?.date, 'MM/dd')
  const start = formatTime(props.registration?.area.time.start)
  const end = formatTime(props.registration?.area.time.end)

  return `${dateString}, ${start} - ${end}`
})

async function onCancel() {
  isCancelling.value = true

  const regID = props.registration?.area.time.registrationID
  if (!regID) {
    return
  }

  await registrationStore.cancel(regID!)

  toast.add({
    title: 'Cancelled Registration',
    description: `Registration for for ${props.registration.area.typeName} on ${registrationTimeString.value} cancelled.`,
    color: 'success'
  })

  isCancelling.value = false
  emit('close', true)
}
</script>
