<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import Close from '~icons/ion/close-outline'
import Arrow from '~icons/ic/twotone-arrow-back'

const route = useRoute()
const { back } = useRouter()

const noArrowRoutes = ['/', '/room']
</script>

<template>
  <div class="floating-menu-wrapper">
    <div class="buttons-wrapper">
      <div class="floating-button">
        <Close class="arrow" />
      </div>
      <Transition name="arrow">
        <div v-if="!noArrowRoutes.includes(route.path)" class="floating-button" @click="back">
          <Arrow class="arrow" />
        </div>
      </Transition>
    </div>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.arrow-enter-active,
.arrow-leave-active {
  @apply transition-all duration-300;
}

.arrow-enter-from,
.arrow-leave-to {
	@apply pointer-events-none;
  @apply opacity-0 scale-50;
}
.floating-menu-wrapper {
  @apply fixed right-2 top-2 z-[999999];
  @apply w-96 bg-gray-950/75 backdrop-blur-lg backdrop-saturate-200 border border-gray-950 rounded-2xl shadow-lg;
  @apply p-5;
  @apply grid place-items-center;
  @apply transition-all duration-300;

  @apply text-white;

  .buttons-wrapper {
    @apply absolute -left-2 top-0 -translate-x-full;
    @apply flex flex-col gap-2;
  }

  .floating-button {
    @apply flex items-center justify-center w-9 h-9 rounded-full;
    @apply text-white transition-all duration-300 bg-gray-950;

    &:hover {
      @apply scale-110;
    }
  }
}
</style>
