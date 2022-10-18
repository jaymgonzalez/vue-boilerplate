<script setup lang="ts">
import { createOne, type APIError } from '@/lib/API'
import type { Todo, TodoWithId } from '@/types'
import { ref } from 'vue'
import { useMutation, useQueryClient } from 'vue-query'

const newTodo = ref('')

const queryClient = useQueryClient()

const { isLoading, error, mutateAsync } = useMutation<
  TodoWithId,
  APIError,
  Todo
>(createOne, {
  onSuccess() {
    queryClient.invalidateQueries('findAll')
  },
})

const formSubmitted = async () => {
  if (newTodo.value.trim()) {
    await mutateAsync({
      content: newTodo.value,
      done: false,
    })
    newTodo.value = ''
  }
}
</script>

<template>
  <q-banner v-if="error" inline-actions class="text-white bg-red">
    {{ error.response?.data.message || error.message }}
  </q-banner>
  <q-form @submit.prevent="formSubmitted" class="q-mt-lg">
    <q-input
      :disable="isLoading"
      v-model="newTodo"
      label="New ToDo"
      color="pink"
    />
    <div class="row justify-end">
      <q-btn
        label="Add ToDo"
        type="submit"
        :loading="isLoading"
        color="pink"
        class="q-mt-md"
        :disable="!newTodo"
      />
    </div>
  </q-form>
</template>
