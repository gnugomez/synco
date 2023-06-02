<script setup lang="ts">
import Arrow from '~icons/ion/chevron-forward-sharp'
</script>

<template>
  <div class="floating-menu-wrapper">
    <Arrow class="arrow" />
  </div>
</template>

<style lang="scss" scoped>
.floating-menu-wrapper {
  @apply fixed right-2 top-2 bottom-2 z-[999999];
  @apply w-[264px] bg-gray-950/75 backdrop-blur-lg backdrop-saturate-200 border-gray-950 rounded-2xl shadow-lg;
  @apply grid place-items-center;
  @apply transition-all duration-300;

  .arrow {
    @apply text-white;
  }
}
</style>
