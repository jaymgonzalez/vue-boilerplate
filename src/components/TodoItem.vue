<script setup lang="ts">
import type { TodoWithId } from '@/types'

const props = defineProps<{ todo: TodoWithId }>()
</script>

<template>
  <q-card class="my-card" :key="props.todo._id">
    <q-card-section class="q-mb-sm">
      {{ props.todo.done ? '✅' : '' }}{{ props.todo.content }}
    </q-card-section>
    <slot />
  </q-card>
</template>
