<template>
  <UModal
    title="Cancel Registration"
    :dismissible="!isCancelling"
    @update:open="onOpenUpdate"
  >
    <template #body>
      <div class="flex items-center flex-col w-full">
        <h1 class="font-bold text-2xl mb-2">
          {{ cancellation?.area.typeName }}
        </h1>

        <div class="mb-2">
          {{ registrationTimeString }}
        </div>

        <div
          v-if="userName"
          class="mb-2"
        >
          {{ userName }}
        </div>

        <div
          v-if="userEmail"
          class="mb-2"
        >
          {{ userEmail }}
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

import { filter, get, map, toNumber } from 'lodash-es'

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

const registrationUser: Ref<{ id: number, email?: string, name?: string } | undefined> = computed(() => get(props.cancellation, 'registration.user'))
const userName = computed(() => registrationUser.value?.name)
const userEmail = computed(() => registrationUser.value?.email)

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

  const regID: number = get(props.cancellation, 'registration.id', props.cancellation?.registration as number)
  if (!regID) {
    return
  }

  if (registrationUser.value) await registrationStore.cancelForUser(regID)
  else await registrationStore.cancel(regID)

  toast.add({
    title: 'Cancelled Registration',
    description: filter([
      `Registration ${props.cancellation.area.typeName} on ${registrationTimeString.value}`,
      userName.value ? `for ${userName.value}` : null,
      'cancelled.'
    ]).join(' '),
    color: 'success'
  })

  isCancelling.value = false
  emit('close', true)
}

function onOpenUpdate(openStatus: boolean) {
  if (openStatus) cancelButtonRef.value?.$el.focus()
}
</script>
