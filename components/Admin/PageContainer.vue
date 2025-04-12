<template>
  <PageContainer
    :title="props.title"
    :max-width="props.maxWidth"
  >
    <div :class="props.wrap ? 'border-1 border-black rounded-sm bg-white': ''">
      <slot />
    </div>
  </PageContainer>
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
  },
  wrap: {
    type: Boolean,
    default: true
  }
})
</script>
