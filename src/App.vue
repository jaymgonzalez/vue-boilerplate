<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useQuasar } from 'quasar'
import { useQueryProvider } from 'vue-query'

useQueryProvider({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

const $q = useQuasar()
const darkQuery = '(prefers-color-scheme: dark)'
const mediaQuery = window.matchMedia(darkQuery)
$q.dark.set(mediaQuery.matches)
mediaQuery.addEventListener('change', (e) => {
  $q.dark.set(e.matches)
})
</script>

<template>
  <div class="app">
    <q-toolbar class="bg-pink">
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
.app {
  max-width: 1024px;
  margin: 0 auto;
}
</style>
