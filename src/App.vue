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
  <div class="q-pa-md q-gutter-y-sm">
    <q-toolbar class="fucsia">
      <q-btn flat round dense icon="menu" />
      <q-toolbar-title>VUE CRUD Client</q-toolbar-title>
    </q-toolbar>
    <main class="container">
      <RouterView />
    </main>
  </div>
</template>

<style>
.container {
  margin: 0 auto;
  width: 90%;
}
</style>
