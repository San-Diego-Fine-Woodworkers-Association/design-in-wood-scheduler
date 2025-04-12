<template>
  <div>
    <div class="flex flex-row">
      <UInput
        v-model="searchTerm"
        icon="i-lucide-user"
        variant="outline"
        class="mr-2 grow-1"
        placeholder="Search for user"
        @keyup.enter="search"
      />

      <UButton
        color="primary"
        :disabled="isSearching"
        @click="search"
      >
        Search
      </UButton>
    </div>

    <div class="h-[200px] w-full border-solid border-gray-300 border-1 bg-white rounded-sm p-2 mt-4">
      <div
        v-if="isSearching"
        class="w-full h-full flex flex-col justify-center items-center"
      >
        <UIcon
          name="i-lucide-refresh-cw"
          class="animate-spin"
        />
      </div>

      <div
        v-else-if="searchError"
        class="w-full h-full flex flex-col justify-center items-center text-red-500"
      >
        An error occurred while searching for users. Please try again.
      </div>

      <div
        v-else-if="isUndefined(results)"
        class="w-full h-full flex flex-col justify-center items-center"
      >
        Use the search bar above to search for users.
      </div>

      <div
        v-else-if="isEmpty(results)"
        class="w-full h-full flex flex-col justify-center items-center"
      >
        No users found.
      </div>

      <div
        v-else
        class="flex flex-col overflow-y-auto h-full"
      >
        <UButton
          v-for="user of results"
          :key="user.id"
          :variant="isSelected(user) ? 'solid' : 'outline'"
          :color="isSelected(user) ? 'primary' : 'neutral'"
          size="lg"
          class="mb-2 cursor-pointer"
          @click="selectUser(user)"
        >
          <template #default>
            <div class="w-full flex flex-row justify-between">
              <div class="grow-1 text-start">
                {{ user.name }}
              </div>

              <div class="text-sm opacity-50 srink-0">
                {{ user.email }}
              </div>
            </div>
          </template>
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isEmpty, isUndefined } from 'lodash-es'
import type { User } from '#auth-utils'

const selectedUser = defineModel<User>()

const searchTerm = ref('')
const searchError: Ref<unknown | undefined> = ref(undefined)
const isSearching = ref(false)
const results: Ref<User[] | undefined> = ref(undefined)

function selectUser(user: User) {
  selectedUser.value = user
}

function isSelected(user: User): boolean {
  return selectedUser.value === user
}

async function search() {
  isSearching.value = true
  selectedUser.value = undefined

  try {
    const users = await $fetch('/api/admin/user/search', {
      key: 'user-search',
      params: { q: searchTerm.value }
    })

    results.value = users
  }
  catch (e) {
    searchError.value = e
  }

  isSearching.value = false
}
</script>
