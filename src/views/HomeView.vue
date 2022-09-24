<script setup lang="ts">
import { useQuery } from 'vue-query'

const query = useQuery('findAll', api.findAll())
</script>

<template>
  <main>
    <h1>Hello World!</h1>
    <q-btn class="fucsia" label="Fuchsia" />
  </main>
</template>

<style>
.fucsia {
  background: #ff0080;
  color: white;
}
</style>
