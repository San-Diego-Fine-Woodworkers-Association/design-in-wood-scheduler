<template>
  <div
    class="mx-auto"
    :class="[{
      md: 'max-w-[700px]',
      lg: 'max-w-[1200px]'
    }[props.maxWidth]]"
  >
    <h1 class="text-2xl font-bold mb-4">
      {{ props.title }}
    </h1>

    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  maxWidth: {
    type: String,
    default: 'lg'
  }
})
</script>
