<script setup lang="ts">
import { useQuery } from 'vue-query'
import { findAll, type APIError } from '@/lib/API'
import type { TodoWithId } from '@/types'
import TodoForm from '@/components/TodoForm.vue'
import TodoItem from '../components/TodoItem.vue'

const { isFetching, error, data } = useQuery<TodoWithId[], APIError>(
  'findAll',
  findAll,
  {
    select(todos) {
      return todos.slice().reverse()
    },
  }
)
</script>
<!-- eslint-disable vue/valid-v-for -->

<template>
  <main>
    <q-banner v-if="error" inline-actions class="text-white bg-red">
      {{ error.response?.data.message || error.message }}
    </q-banner>
    <todo-form />
    <div
      :style="{ opacity: isFetching ? '1' : '0' }"
      class="loading q-pa-md flex flex-center"
    >
      <q-linear-progress indeterminate color="pink" />
    </div>
    <todo-item
      v-for="todo in data"
      :key="todo._id.toString()"
      :todo="todo"
      class="q-mb-sm"
    />
  </main>
</template>

<style scoped>
.loading {
  height: 25px;
  transition-duration: 500ms;
}
</style>
