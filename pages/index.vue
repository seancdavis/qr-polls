<script setup lang="ts">
const { data } = await useFetch("/api/polls/9387ee29-81a1-4f1e-b979-b31d8caade26");
</script>

<template>
  <p class="text-3xl font-bold underline">Hello World</p>
  <pre>{{ data }}</pre>
</template>
