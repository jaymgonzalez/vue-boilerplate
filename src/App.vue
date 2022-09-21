<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const darkQuery = '(prefers-color-scheme: dark)'
const mediaQuery = window.matchMedia(darkQuery)
$q.dark.set(mediaQuery.matches)
mediaQuery.addEventListener('change', (e) => {
  $q.dark.set(e.matches)
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
