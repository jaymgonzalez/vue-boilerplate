<script setup lang="ts">
import { defineProps } from 'vue'

type IsFetchingProps = { isFetching: Boolean }
const props = defineProps<IsFetchingProps>()
</script>

<template>
  <div
    :style="{ opacity: props.isFetching ? '1' : '0' }"
    class="loading q-pa-md flex flex-center"
  >
    <q-linear-progress indeterminate color="pink" />
  </div>
</template>
<style scoped>
.loading {
  height: 25px;
  transition-duration: 500ms;
}
</style>
