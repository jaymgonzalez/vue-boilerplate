<script setup lang="ts">
import { findOne, type APIError } from '@/lib/API'
import type { TodoWithId } from '@/types'
import { useRoute } from 'vue-router'
import { useQuery } from 'vue-query'
import TodoItem from '@/components/TodoItem.vue'

const route = useRoute()
const id = route.params.id.toString()

const { isFetching, error, data } = useQuery<TodoWithId, APIError>(
  ['findOne', id],
  () => findOne(id)
)
</script>

<template>
  <todo-item v-if="data" :todo="data" />
</template>
