<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { usePointer, useToggle } from '@vueuse/core'
import { ref, watch } from 'vue'
import Close from '~icons/ic/baseline-close'
import Arrow from '~icons/ic/twotone-arrow-back'

const route = useRoute()
const { back } = useRouter()

const noArrowRoutes = ['/', '/room']

const [closed, toggleClose] = useToggle(false)

const { x, y } = usePointer()
const isPointerActive = ref(false)
watch([x, y], ([x, y], [oldX, oldY]) => {
  if (!isPointerActive.value && (x !== oldX || y !== oldY)) {
    isPointerActive.value = true
    setTimeout(() => {
      isPointerActive.value = false
    }, 5000)
  }
})
</script>

<template>
  <div class="floating-menu-wrapper" :class="{ closed }">
    <div class="buttons-wrapper">
      <div
        class="floating-button"
        :class="{ hide: closed && !isPointerActive }"
        @click="toggleClose()"
      >
        <Close class="arrow close" />
      </div>
      <Transition name="arrow">
        <div
          v-if="!noArrowRoutes.includes(route.path) && !closed"
          class="floating-button"
          @click="back"
        >
          <Arrow class="arrow" />
        </div>
      </Transition>
    </div>
    <div class="wrapper">
      <slot />
    </div>
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
  @apply fixed right-14 top-14 z-[999999];
  @apply transition-all duration-500;
  @apply text-white;

  .hide {
    @apply opacity-0;
  }

  .wrapper {
    @apply w-96 bg-gray-950/75 backdrop-blur-lg backdrop-saturate-200 border-2 border-white/10 rounded-2xl shadow-lg;
    @apply p-5;
    @apply grid place-items-center;
    @apply transition-all duration-500 overflow-hidden;
  }

  .arrow.close {
    @apply transition-all duration-300;
  }

  &.closed {
    @apply translate-x-full;

    .arrow.close {
      @apply rotate-45;
    }

    .wrapper {
      @apply opacity-0 scale-75;
    }
  }

  .buttons-wrapper {
    @apply absolute -left-2 top-0 -translate-x-full;
    @apply flex flex-col gap-2;
  }

  .floating-button {
    @apply flex items-center justify-center w-9 h-9 rounded-full;
    @apply text-white transition-all duration-300 bg-gray-950 border-2 border-white/10;

    &:hover {
      @apply scale-110;
    }
  }
}
</style>
