<template>
  <div class="grid grid-cols-3 gap-5 items-center mx-5">
    <div class="flex items-center">
      <h1 class="text-2xl font-serif">
        Design in Wood
      </h1>

      <div
        class="pl-5"
      >
        {{ formatDate(calendarStore.firstDate || new Date()) }} - {{ formatDate(calendarStore.lastDate || new Date()) }}
      </div>
    </div>

    <UNavigationMenu
      :items="menu"
      class="justify-self-center z-20"
    />

    <UButton
      v-if="loggedIn"
      class="w-[120px] justify-self-end flex flex-row justify-center"
      loading-auto
      @click="signOut"
    >
      Sign Out
    </UButton>

    <UButton
      v-if="!loggedIn"
      class="w-[120px] justify-self-end flex flex-row justify-center"
      @click="signIn"
    >
      Sign In
    </UButton>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'

const calendarStore = useCalendarStore()
const { isAuthorized } = useAuthorizationStore()
const { loggedIn, user, clear } = useUserSession()
const router = useRouter()

async function signOut() {
  await clear()
  await calendarStore.fetch()
}

function signIn() {
  isAuthorized()
}

const menu = computed(() => [
  [
    {
      label: 'Sign Up',
      to: '/sign-up',
      icon: 'i-lucide-calendar-search'
    },
    {
      label: 'My Registrations',
      to: '/my-registrations',
      icon: 'i-lucide-calendar-check'
    },
    ...(user.value?.isAdmin
      ? [{
          label: 'Admin',
          icon: 'i-lucide-key-round',
          active: router.currentRoute.value.path.startsWith('/admin') ? true : false,
          children: [{
            label: 'Registrations',
            to: '/admin/registrations',
            icon: 'i-lucide-calendar-check'
          }, {
            label: 'Fair Dates',
            to: '/admin/fair-dates',
            icon: 'i-lucide-calendar-cog'
          }, {
            label: 'Time Slots',
            to: '/admin/time-slots',
            icon: 'i-lucide-calendar-clock'
          }, {
            label: 'Controls',
            to: '/admin/controls',
            icon: 'i-lucide-sliders-horizontal'
          }]
        }]
      : [])
  ]
])

const formatDate = (date: Date) => {
  return format(date, 'MM/dd')
}
</script>
