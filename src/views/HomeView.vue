<script setup lang="ts">
import { useQuery } from 'vue-query'
import { findAll, type APIError } from '@/lib/API'
import type { TodoWithId } from '@/types'

const { isLoading, error, data } = useQuery<TodoWithId[], APIError>(
  'findAll',
  () => findAll()
)
</script>
<!-- eslint-disable vue/valid-v-for -->

<template>
  <main>
    <div class="q-pa-md flex flex-center" v-if="isLoading">
      <q-circular-progress indeterminate rounded size="50px" />
    </div>
    <q-banner v-if="error" inline-actions class="text-white bg-red">
      {{ error.response?.data.message || error.message }}
    </q-banner>
    <q-card class="my-card" v-for="todo in data">
      <q-card-section>
        {{ todo.content }}
      </q-card-section>
    </q-card>
  </main>
</template>

<style>
.fucsia {
  background: #ff0080;
  color: white;
}
</style>
