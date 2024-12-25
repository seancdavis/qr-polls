<script setup lang="ts">
const route = useRoute();
const { data } = await useFetch(`/api/polls/${route.params.id}`);
</script>

<template>
  <div v-if="data == null">No data</div>
  <div v-else>
    <h1 class="text-3xl font-bold underline">{{ data.title }}</h1>
    <pre>{{ data }}</pre>
  </div>
</template>
