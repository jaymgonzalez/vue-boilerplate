<script setup lang="ts">
import type { TodoWithId } from '@/types'
import { defineProps } from 'vue'

type TodoItemProps = { todo: TodoWithId }
const props = defineProps<TodoItemProps>()
</script>

<template>
  <q-card class="my-card" :key="props.todo._id">
    <q-card-section class="q-mb-sm">
      {{ props.todo.content }}
      <q-card-actions class="row justify-end">
        <q-btn
          :to="{ name: 'todo', params: { id: props.todo._id.toString() } }"
          color="pink-6"
        >
          Edit
        </q-btn>
      </q-card-actions>
    </q-card-section>
  </q-card>
</template>
