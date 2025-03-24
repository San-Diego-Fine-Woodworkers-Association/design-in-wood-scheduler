<template>
  <UModal
    title="Confirm Registration"
    :dismissible="!isRegistering"
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
        :disabled="isRegistering"
        @click="emit('close')"
      >
        Cancel
      </UButton>
      <UButton
        color="primary"
        variant="solid"
        loading-auto
        @click="onConfirm"
      >
        Register
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

const isRegistering = ref(false)

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

async function onConfirm() {
  isRegistering.value = true

  await registrationStore.register(props.registration)

  toast.add({
    title: 'Registered',
    description: `Registered for ${props.registration.area.typeName} on ${registrationTimeString.value}.`,
    color: 'success'
  })

  isRegistering.value = false
  emit('close', true)
}
</script>
