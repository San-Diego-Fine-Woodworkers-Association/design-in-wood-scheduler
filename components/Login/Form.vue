<template>
  <UModal
    class="w-80 h-[350px] p-6"
    @after:leave="() => onCancel(false)"
  >
    <template #content>
      <div class="absolute top-4 right-4 border-none">
        <UButton
          icon="i-lucide-x"
          variant="ghost"
          @click="() => onCancel(true)"
        />
      </div>

      <UForm
        :schema="schema"
        :state="state"
        :disabled="isLoggingIn"
        class="flex flex-col justify-between h-100"
        @submit="onSubmit"
      >
        <div class="flex flex-col items-center">
          <h1 class="text-3xl ml-4 mr-4 my-6">
            Login
          </h1>

          <UFormField
            label="Email"
            name="email"
            help="Enter the email you use for ProClass"
            :error="emailError"
            size="xl"
            class="w-full"
          >
            <UInput
              v-model="state.email"
              class="w-full"
              @update:model-value="clearError"
            />
          </UFormField>
        </div>

        <div class="flex flex-col mt-5">
          <UButton
            color="primary"
            variant="solid"
            type="submit"
            size="xl"
            class="flex justify-center"
            :loading="isLoggingIn"
          >
            Login
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const toast = useToast()
const { fetch: refreshSession } = useUserSession()
const calendarStore = useCalendarStore()

const emit = defineEmits(['close'])
const isLoggingIn = ref(false)
const emailError = ref<string | undefined>(undefined)

let loginAbortController: AbortController | null = null

const schema = z.object({
  email: z.string().email('Invalid email')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined
})

function clearError(): void {
  emailError.value = undefined
}

function onCancel(shouldClose: boolean = true): void {
  if (loginAbortController) loginAbortController.abort('cancel')
  if (shouldClose) emit('close', false)
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoggingIn.value = true
  loginAbortController = new AbortController()

  const { error } = await useFetch('/api/login', {
    method: 'post',
    body: { email: event.data.email },
    signal: loginAbortController.signal
  })

  if (error.value) {
    isLoggingIn.value = false

    if (error.value.cause === 'cancel') return
    if (error.value.statusCode === 401) emailError.value = 'Invalid email address. Please try again.'
    else {
      toast.add({
        title: 'Login failed',
        description: 'An error occurred trying to log you in. Please contact the web administrator.',
        color: 'error'
      })
    }

    return
  }

  await refreshSession()
  await calendarStore.fetch()

  emit('close', true)
  isLoggingIn.value = false
}
</script>
