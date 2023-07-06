<script setup lang="ts">
import Arrow from '~icons/ion/close-outline'
</script>

<template>
  <div class="floating-menu-wrapper">
    <div class="button">
      <Arrow class="arrow" />
    </div>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.floating-menu-wrapper {
  @apply fixed right-2 top-2 z-[999999];
  @apply w-96 bg-gray-950/75 backdrop-blur-lg backdrop-saturate-200 border border-gray-950 rounded-2xl shadow-lg;
  @apply p-5;
  @apply grid place-items-center;
  @apply transition-all duration-300;

  @apply text-white;

  .button {
    @apply flex items-center justify-center w-9 h-9 rounded-full;
    @apply absolute -left-2 top-0 -translate-x-full;
    @apply text-white transition-all duration-300 bg-gray-950;

    &:hover {
      @apply scale-110;
    }
  }
}
</style>
