<template>
  <UModal
    :dismissible="!isLoggingIn"
    class="w-80"
  >
    <template #content>
      <div class="flex flex-col items-center">
        <h1 class="text-3xl m-4">
          Login
        </h1>

        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          :disabled="isLoggingIn"
          @submit="onSubmit"
        >
          <UFormField
            label="Email"
            name="email"
            size="xl"
          >
            <UInput v-model="state.email" />
          </UFormField>

          <UFormField
            label="Member ID"
            name="memberID"
            size="xl"
          >
            <UInput
              v-model="state.memberID"
              type="text"
            />
          </UFormField>

          <div class="flex flex-col my-5">
            <UButton
              color="primary"
              variant="solid"
              type="submit"
              size="xl"
              class="mb-2"
              :loading="isLoggingIn"
            >
              Login
            </UButton>

            <UButton
              variant="outline"
              size="xl"
              class="mb-2"
              @click="emit('close')"
            >
              Cancel
            </UButton>
          </div>
        </UForm>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const { fetch: refreshSession } = useUserSession()
const calendarStore = useCalendarStore()

const emit = defineEmits(['close'])
const isLoggingIn = ref(false)

const schema = z.object({
  email: z.string().email('Invalid email'),
  memberID: z.string()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  memberID: undefined
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoggingIn.value = true

  try {
    await $fetch('/api/login', { method: 'post', body: { email: event.data.email, memberID: event.data.memberID } })

    await refreshSession()

    await calendarStore.fetch()

    emit('close', true)
    isLoggingIn.value = false
  }
  catch (err) {
    isLoggingIn.value = false
    console.error(err)
  }
}
</script>
