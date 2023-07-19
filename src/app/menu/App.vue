<script setup lang="ts">
import { RouterView } from 'vue-router'
import FloatingMenu from './common/FloatingMenu.vue'
import ResetStyle from './common/ResetStyle.vue'
</script>

<template>
  <ResetStyle>
    <FloatingMenu>
      <RouterView />
    </FloatingMenu>
  </ResetStyle>
</template>
