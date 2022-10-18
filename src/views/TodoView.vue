<script setup lang="ts">
import { findOne, type APIError } from '@/lib/API'
import type { TodoWithId } from '@/types'
import { useRoute } from 'vue-router'
import { useQuery } from 'vue-query'
import TodoItem from '@/components/TodoItem.vue'
import LinearLoading from '@/components/LinearLoading.vue'

const route = useRoute()
const id = route.params.id.toString()

const { isFetching, error, data } = useQuery<TodoWithId, APIError>(
  ['findOne', id],
  () => findOne(id)
)
</script>

<template>
  <q-banner v-if="error" inline-actions class="text-white bg-red">
    {{ error.response?.data.message || error.message }}
  </q-banner>
  <linear-loading :isFetching="isFetching" />
  <todo-item v-if="data" :todo="data">
    <slot>
      <q-card-actions class="row justify-between">
        <q-btn
          :to="{ name: 'todo', params: { id: data._id.toString() } }"
          color="pink-6"
        >
          Toggle done
        </q-btn>
        <q-btn
          :to="{ name: 'todo', params: { id: data._id.toString() } }"
          color="red"
        >
          Remove
        </q-btn>
      </q-card-actions>
    </slot>
  </todo-item>
</template>
