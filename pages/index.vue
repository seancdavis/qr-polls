<script setup lang="ts">
const { data } = await useFetch("/api/polls/1");
</script>

<template>
  <p class="text-3xl font-bold underline">Hello World</p>
  <pre>{{ data }}</pre>
</template>
