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

        <AdminUserSearch
          v-if="registration.search"
          v-model="selectedUser"
          class="mt-4 w-[400px]"
        />
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

      <UTooltip
        :text="confirmLabel!"
        :disabled="!confirmLabel"
      >
        <UButton
          color="primary"
          variant="solid"
          loading-auto
          :disabled="isConfirmDisabled"
          @click="onConfirm"
        >
          Register
        </UButton>
      </UTooltip>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { format } from 'date-fns'

import { map, toNumber } from 'lodash-es'
import type { RegisterEvent } from './CalendarCell.vue'
import type { User } from '#auth-utils'

const toast = useToast()

const registrationStore = useRegistrationStore()

const emit = defineEmits(['close'])
const props = defineProps({
  registration: {
    default: null,
    type: Object as PropType<RegisterEvent>
  }
})

const selectedUser: Ref<User | undefined> = ref(undefined)
const isConfirmDisabled = computed(() => props.registration.search && !selectedUser?.value)
const confirmLabel = computed(() => isConfirmDisabled.value ? 'Must select a user' : null)
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

  if (selectedUser.value) await registrationStore.registerForUser(props.registration, selectedUser.value.id)
  else await registrationStore.register(props.registration)

  toast.add({
    title: 'Registered',
    description: `Registered for ${props.registration.area.typeName} on ${registrationTimeString.value}.`,
    color: 'success'
  })

  isRegistering.value = false
  emit('close', true)
}
</script>
