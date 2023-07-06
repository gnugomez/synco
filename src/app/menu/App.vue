<script setup lang="ts">
import { RouterView } from 'vue-router'
import FloatingMenu from './FloatingMenu.vue'
import ResetStyle from './ResetStyle.vue'
</script>

<template>
  <ResetStyle>
    <FloatingMenu>
      <RouterView />
    </FloatingMenu>
  </ResetStyle>
</template>
